import _ from "lodash";
import {LINK_STATIC_URL} from "@/configs";
import {FileUpload} from "@/utils/types";
import {ObjectId, Course, User, Score, Admin} from "../models";
import {Class} from "../models/class";
import {USER_TYPE} from "@/utils/helpers/constants";

export async function getAllClass() {
    const classes = await Class.find({
        deleted: false,
    });
    return {classes};
}

export async function getListClass({q, page, per_page, field, sort_order, course_id}) {
    q = q ? {$regex: q, $options: "i"} : null;
    const query = Class.aggregate();
    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        ...(course_id && {course_id: new ObjectId(course_id)}),
        deleted: false,
    };
    query.match(filter);
    query.sort({[field]: sort_order}).facet({
        metadata: [{$count: "total"}],
        data: [
            {$skip: (page - 1) * per_page},
            {$limit: per_page},
            {
                $lookup: {
                    from: "admins", // truy vấn đến collection "admins"
                    localField: "creator_id", // trường creator_id trong Class
                    foreignField: "_id", // trường _id trong Admin
                    as: "creator_info", // kết quả sẽ nằm trong trường creator_info
                },
            },
            {
                $lookup: {
                    from: "admins", // truy vấn đến collection "admins"
                    localField: "teacher_id", // trường creator_id trong Class
                    foreignField: "_id", // trường _id trong Admin
                    as: "teacher_info", // kết quả sẽ nằm trong trường creator_info
                },
            },
            {
                $lookup: {
                    from: "courses", // truy vấn đến collection "courses"
                    localField: "course_id", // trường course_id trong Class
                    foreignField: "_id", // trường _id trong Course
                    as: "course_info", // kết quả sẽ nằm trong trường course_info
                },
            },
        ],
    });

    const [result] = await query.exec();

    const total = _.isEmpty(result.metadata) ? 0 : result.metadata[0].total;

    const classes = result.data.map((classOf) => {
        classOf.images_src = classOf.images.map((img) => LINK_STATIC_URL + img);
        classOf.image_featured =
            _.isNumber(classOf.image_featured) && classOf.images_src[classOf.image_featured];
        classOf.file_record = LINK_STATIC_URL + classOf.file_record;
        classOf.name_file = classOf.name_file === "null" ? classOf.name_file : "";

        // Lấy thông tin người tạo
        const creator = classOf.creator_info?.[0] || {};
        classOf.creator = {
            _id: creator._id,
            name: creator.name,
            avatar: creator.avatar ? LINK_STATIC_URL + creator.avatar : null,
            email: creator.email,
        };

        // Lấy thông tin huấn luyện viên
        const teacher = classOf.teacher_info?.[0] || {};
        classOf.teacher = {
            _id: teacher._id,
            name: teacher.name,
            avatar: teacher.avatar ? LINK_STATIC_URL + teacher.avatar : null,
            email: teacher.email,
        };

        // Lấy thông tin khóa tập
        const course = classOf.course_info?.[0] || {};
        classOf.course = {
            _id: course._id,
            name: course.name,
            code: course.code,
            price: course.current_price,
            start_time: course.start_time,
            end_time: course.end_time,
        };

        const {creator_info, teacher_info, course_info, ...result} = classOf;

        return result;
    });

    return {
        total,
        page: _.isNumber(per_page) ? page : 1,
        per_page: _.isNumber(per_page) ? per_page : total,
        classes: classes,
    };
}

export async function getListClassByCourseId(courseId, {q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;
    const query = Class.aggregate();
    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
    };
    query
        .match(filter)
        .lookup({
            from: "class_courses",
            localField: "_id",
            foreignField: "class_id",
            as: "class_courses",
        })
        .unwind("$class_courses")
        .match({"class_courses.course_id": new ObjectId(courseId)});

    query.sort({[field]: sort_order}).facet({
        metadata: [{$count: "total"}],
        data: [
            {$skip: (page - 1) * per_page},
            {$limit: per_page},
            {
                $lookup: {
                    from: "class_courses",
                    localField: "_id",
                    foreignField: "class_id",
                    as: "class_courses",
                },
            },
        ],
    });

    const [result] = await query.exec();

    const total = _.isEmpty(result.metadata) ? 0 : result.metadata[0].total;

    const courseIds = _.flatMap(result.data, (classOf) => classOf.class_courses.map((pc) => pc.course_id));
    const uniqueCourseIds = _.uniq(courseIds);

    const courses = await Course.find({_id: {$in: uniqueCourseIds}});

    const courseMap = _.keyBy(courses, "_id");

    const classes = result.data.map((classOf) => {
        classOf.images_src = classOf.images.map((img) => LINK_STATIC_URL + img);
        classOf.image_featured =
            _.isNumber(classOf.image_featured) && classOf.images_src[classOf.image_featured];
        classOf.courses = classOf.class_courses.map((pc) => courseMap[pc.course_id] || {});
        const {class_courses, ...result} = classOf;
        result.course_id = class_courses[0].course_id;
        return result;
    });

    return {
        total,
        page: _.isNumber(per_page) ? page : 1,
        per_page: _.isNumber(per_page) ? per_page : total,
        classes: classes,
    };
}

export async function getDetailClass(classOfId) {
    const classOf = await Class.findOne({_id: classOfId, deleted: false});

    const crt = await User.findOne({_id: classOf.creator_id, deleted: false});

    classOf.file_record = LINK_STATIC_URL + classOf.file_record;
    classOf.images = classOf.images.map((img) => LINK_STATIC_URL + img);

    return {
        ...classOf.toObject(),
        creator: crt._id
            ? {
                _id: crt._id,
                name: crt.name,
                email: crt.email,
                avatar: crt.avatar ? LINK_STATIC_URL + crt.avatar : null,
            }
            : null,
    };
}

export async function getStudentOfClass(classOfId) {
    // Tìm lớp thể thao có course_id bằng courseId và currentAccount._id nằm trong student_ids
    const classFound = await Class.findOne({
        _id: classOfId,
        deleted: false,
    }).lean();

    classFound.file_record = classFound.file_record ? LINK_STATIC_URL + classFound.file_record : null;

    // Nếu không tìm thấy lớp thể thao thì trả về { data: null }
    if (!classFound) {
        return {data: null};
    }

    // Lấy danh sách hội viên từ mảng student_ids
    const students = await User.find({
        _id: {$in: classFound.student_ids},
    }).lean();

    // Nối LINK_STATIC_URL vào avatar của mỗi hội viên
    students.forEach((student) => {
        if (student.avatar) {
            student.avatar = LINK_STATIC_URL + student.avatar;
        }
    });

    // Lấy thông tin huấn luyện viên
    const teacher = await Admin.findOne({
        _id: classFound.teacher_id,
        user_type: USER_TYPE.TEACHER,
    }).lean();

    // Nếu huấn luyện viên có avatar thì nối LINK_STATIC_URL
    if (teacher && teacher.avatar) {
        teacher.avatar = LINK_STATIC_URL + teacher.avatar;
    }

    // Lấy danh sách điểm của từng hội viên trong lớp thể thao từ bảng Score
    const scores = await Score.find({
        class_id: classFound._id,
        student_id: {$in: classFound.student_ids},
    }).lean();

    // Gán thông tin điểm vào đúng hội viên
    students.forEach((student) => {
        const studentScore = scores.find((score) => score.student_id === student._id.toString());
        if (studentScore) {
            student.attendance_score = studentScore.attendance_score;
            student.plus_score = studentScore.plus_score;
            student.midterm_score = studentScore.midterm_score;
            student.final_score = studentScore.final_score;
        }
    });

    // Định dạng kết quả trả về
    return {
        ...classFound,
        students, // Thêm danh sách hội viên vào object lớp thể thao
        teacher, // Thêm thông tin huấn luyện viên vào object lớp thể thao
    };
}

export async function createClass(
    {images, image_featured, course_id, file_record, max_number_student, notes, ...data},
    creator_id,
) {
    const lastClass = await Class.findOne().sort({code: -1});

    let newCode = "CL000001";

    if (lastClass) {
        const lastCode = lastClass.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `CL${numberPart.toString().padStart(6, "0")}`;
    }

    images = await Promise.all(images.map((img) => img.save("images/classes")));

    if (file_record === null) {
        file_record = null;
    }

    if (file_record && file_record !== "null") {
        file_record = await file_record.save("file_record");
    }
    const classOf = new Class({
        ...data,
        code: newCode,
        images,
        image_featured: images.length > 0 && _.isNumber(image_featured) ? image_featured : null,
        file_record,
        creator_id: creator_id._id,
        course_id: course_id,
        max_number_student: max_number_student,
        notes: notes,
    });

    const newClass = await classOf.save();

    // Tạo bản ghi trong Score cho từng hội viên nếu chưa tồn tại
    if (Array.isArray(classOf.student_ids) && classOf.student_ids.length > 0) {
        for (const studentId of classOf.student_ids) {
            const existingScore = await Score.findOne({student_id: studentId, class_id: classOf._id});
            if (!existingScore) {
                const newScore = new Score({
                    student_id: studentId,
                    class_id: classOf._id,
                    attendance_score: 0,
                    plus_score: 0,
                    midterm_score: 0,
                    final_score: 0,
                });
                await newScore.save();
            }
        }
    }

    return classOf;
}

export async function updateClass(
    classOf,
    {
        name,
        description,
        images,
        image_featured,
        course_id,
        teacher_id,
        file_record,
        name_file,
        start_time,
        end_time,
        notes,
        status,
        max_number_student,
        student_ids,
    },
    creator,
) {
    // Logic cập nhật thông tin class
    const keepImages = classOf.images.filter((img) => images.includes(img));
    const removeImages = classOf.images.filter((img) => !images.includes(img));
    images = images.filter((img) => img instanceof FileUpload).map((img) => img.save("images/classes"));
    if (file_record && typeof file_record !== "string") {
        classOf.file_record = await file_record.save("file_record");
    }
    const newImages = await Promise.all(images);

    for (const img of removeImages) {
        FileUpload.remove(img);
    }

    classOf.name = name;
    classOf.description = description;
    classOf.images = [...keepImages, ...newImages];
    classOf.image_featured = classOf.images.length > 0 && _.isNumber(image_featured) ? image_featured : null;
    classOf.name_file = name_file;
    classOf.start_time = start_time;
    classOf.end_time = end_time;
    classOf.course_id = course_id;
    classOf.teacher_id = teacher_id;
    classOf.student_ids = student_ids;
    classOf.max_number_student = max_number_student;
    classOf.notes = notes;
    classOf.status = status;

    await classOf.save();

    // Tạo bản ghi trong Score cho từng hội viên nếu chưa tồn tại
    if (Array.isArray(classOf.student_ids) && classOf.student_ids.length > 0) {
        for (const studentId of classOf.student_ids) {
            const existingScore = await Score.findOne({student_id: studentId, class_id: classOf._id});
            if (!existingScore) {
                const newScore = new Score({
                    student_id: studentId,
                    class_id: classOf._id,
                    attendance_score: 0,
                    plus_score: 0,
                    midterm_score: 0,
                    final_score: 0,
                });
                await newScore.save();
            }
        }
    }

    // Tìm tất cả các class có cùng course_id
    const classesWithSameCourse = await Class.find({course_id: classOf.course_id});

    // Lấy tất cả student_ids từ các class này
    let allStudentIds = [];
    classesWithSameCourse.forEach((c) => {
        allStudentIds = [...allStudentIds, ...c.student_ids];
    });

    // Lọc bỏ các student_ids trùng lặp
    const uniqueStudentIds = _.uniq(allStudentIds);

    // Tìm bản ghi trong bảng Course có _id bằng với classOf.course_id
    const courseToUpdate = await Course.findOne({_id: classOf.course_id});

    if (courseToUpdate) {
        // Cập nhật trường student_of_course với uniqueStudentIds
        courseToUpdate.student_of_course = uniqueStudentIds;

        // Lưu lại bản ghi đã cập nhật
        await courseToUpdate.save();

    } else {
        console.log("Không tìm thấy course có course_id tương ứng");
    }

    return classOf;
}

export async function deleteClass(classOf) {
    // Xóa tất cả hình ảnh liên quan đến class
    for (const img of classOf.images) {
        FileUpload.remove(img);
    }
    // Xóa file record của class
    FileUpload.remove(classOf.file_record);

    // Cập nhật trạng thái của class thành đã xóa
    classOf.deleted = true;
    await classOf.save();

    // Xóa tất cả bản ghi trong bảng Score có class_id bằng classOf._id
    await Score.deleteMany({class_id: classOf._id});

}

export async function changeStatusClass(classOf, status) {
    if (status) {
        classOf.status = status;
    }

    await classOf.save();
}

//ForUser
