import {Course, Admin} from "@/app/models";
import {LINK_STATIC_URL} from "@/configs";
import _ from "lodash";
import {Class} from "../models/class";

export async function getListMyCalendar({q, page, per_page, field, sort_order}, currentAccount) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
        student_of_course: currentAccount._id, // Lọc các khóa tập mà currentAccount._id đang tham gia
    };

    // Chuyển sort_order thành giá trị số
    const sortOrderValue = sort_order === "desc" ? -1 : 1;

    // Truy vấn để lấy danh sách Course
    const courses = await Course.aggregate([
        {$match: filter},
        {$sort: {[field]: sortOrderValue}},
        {$skip: (page - 1) * per_page},
        {$limit: per_page},
        {
            $lookup: {
                from: "classes",
                localField: "_id",
                foreignField: "course_id",
                as: "classes_info",
            },
        },
    ]);

    // Lấy danh sách teacher_id từ các lớp
    const teacherIds = _.uniq(
        courses.flatMap((course) => course.classes_info.map((classItem) => classItem.teacher_id)),
    ).filter(Boolean); // Lọc ra các giá trị hợp lệ (không null/undefined)

    // Lấy thông tin giáo viên từ model Admin
    const teachers = await Admin.find({_id: {$in: teacherIds}})
        .select("_id name avatar email gender phone")
        .lean();

    // Tạo mapping từ teacher_id -> thông tin giáo viên
    const teacherMap = teachers.reduce((map, teacher) => {
        map[teacher._id] = {
            ...teacher,
            avatar: teacher.avatar ? LINK_STATIC_URL + teacher.avatar : null, // Thêm LINK_STATIC_URL trước avatar
        };
        return map;
    }, {});

    // Xử lý các kết quả, thêm URL tĩnh vào các hình ảnh
    const coursesEdit = courses.map((classOf) => {
        return {
            ...classOf,
            classes: classOf.classes_info
                .map((classItem) => ({
                    ...classItem,
                    start_time: classOf.start_time, // Thêm start_time của course
                    end_time: classOf.end_time, // Thêm end_time của course
                    images: classItem.images.map((img) => LINK_STATIC_URL + img),
                    image_featured:
                        _.isNumber(classItem.image_featured) &&
                        LINK_STATIC_URL + classItem.images[classItem.image_featured],
                    course: {
                        _id: classOf._id,
                        code: classOf.code,
                        name: classOf.name,
                        images: classOf.images.map((img) => LINK_STATIC_URL + img),
                        image_featured: classOf.image_featured,
                        start_time: classOf.start_time,
                        end_time: classOf.end_time,
                    },
                    teacher: teacherMap[classItem.teacher_id] || null, // Thêm thông tin giáo viên
                }))
                .filter((classItem) => !classItem.deleted), // Lọc các lớp không bị xóa
        };
    });

    const total = await Course.countDocuments(filter);

    // Lấy thông tin các lớp
    const classes = coursesEdit.flatMap((course) => course.classes);

    return {
        total,
        page,
        per_page,
        classes,
    };
}

export async function getListMyCalendarTeacher({ q }, currentAccount) {
    if (currentAccount.user_type === "ADMIN" || currentAccount.user_type === null) {
        q = q ? { $regex: q, $options: "i" } : null;
        const filter = {
            ...(q && { $or: [{ name: q }, { code: q }] }),
            deleted: false,
        };

        const classes = await Class.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $unwind: {
                    path: "$course",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "admins",
                    localField: "teacher_id",
                    foreignField: "_id",
                    as: "teacher",
                },
            },
            {
                $unwind: {
                    path: "$teacher",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    start_time: { $ifNull: ["$course.start_time", null] },
                    end_time: { $ifNull: ["$course.end_time", null] },
                    image_featured: {
                        $cond: {
                            if: {
                                $and: [
                                    { $isArray: "$images" },
                                    { $gt: [{ $size: "$images" }, "$image_featured"] },
                                ],
                            },
                            then: {
                                $concat: [LINK_STATIC_URL, { $arrayElemAt: ["$images", "$image_featured"] }],
                            },
                            else: "full",
                        },
                    },
                    "teacher.avatar": {
                        $cond: {
                            if: { $ne: ["$teacher.avatar", null] },
                            then: { $concat: [LINK_STATIC_URL, "$teacher.avatar"] },
                            else: "full",
                        },
                    },
                },
            },
            {
                $project: {
                    "course.code": 1,
                    "course.name": 1,
                    "course.start_time": 1,
                    "course.end_time": 1,
                    code: 1,
                    name: 1,
                    creator_id: 1,
                    updater_id: 1,
                    course_id: 1,
                    student_ids: 1,
                    teacher_id: 1,
                    "teacher.name": 1,
                    "teacher.email": 1,
                    "teacher.avatar": 1,
                    "teacher.phone": 1,
                    images: 1,
                    image_featured: 1,
                    name_file: 1,
                    file_record: 1,
                    max_number_student: 1,
                    notes: 1,
                    deleted: 1,
                    created_at: 1,
                    updated_at: 1,
                    start_time: 1,
                    end_time: 1,
                },
            },
        ]);

        return {
            classes,
        };
    }


    if (currentAccount.user_type === "TEACHER") {
        q = q ? { $regex: q, $options: "i" } : null;

        const filter = {
            ...(q && { $or: [{ name: q }, { code: q }] }),
            deleted: false,
            teacher_id: currentAccount._id,
        };

        const classes = await Class.aggregate([
            { $match: filter },
            {
                $lookup: {
                    from: "courses",
                    localField: "course_id",
                    foreignField: "_id",
                    as: "course",
                },
            },
            {
                $unwind: {
                    path: "$course",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    start_time: { $ifNull: ["$course.start_time", null] },
                    end_time: { $ifNull: ["$course.end_time", null] },
                    image_featured: {
                        $cond: {
                            if: {
                                $and: [
                                    { $isArray: "$images" },
                                    { $gt: [ { $size: "$images" }, "$image_featured" ] },
                                ],
                            },
                            then: {
                                $concat: [LINK_STATIC_URL, { $arrayElemAt: ["$images", "$image_featured"] }],
                            },
                            else: "full",
                        },
                    },
                },
            },
            {
                $project: {
                    "course.code": 1,
                    "course.name": 1,
                    "course.start_time": 1,
                    "course.end_time": 1,
                    code: 1,
                    name: 1,
                    creator_id: 1,
                    updater_id: 1,
                    course_id: 1,
                    student_ids: 1,
                    teacher_id: 1,
                    images: 1,
                    image_featured: 1,
                    name_file: 1,
                    file_record: 1,
                    max_number_student: 1,
                    notes: 1,
                    deleted: 1,
                    created_at: 1,
                    updated_at: 1,
                    start_time: 1,
                    end_time: 1,
                },
            },
        ]);

        return {
            classes,
        };
    }
}

