import {Admin, Course, Score, User} from "@/app/models";
import {LINK_STATIC_URL} from "@/configs";
import {STATUS_ACTIVE} from "@/utils/helpers/constants";
import {FileUpload} from "@/utils/types";
import _ from "lodash";
import {Class} from "../models/class";

export async function getAllCourse() {
    const courses = await Course.find({
        deleted: false,
    });
    return {courses};
}

export async function getListCourse({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
    };

    // Sử dụng populate để lấy thông tin của creator
    const courses = await Course.find(filter)
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order})
        .populate({
            path: "creator_id", // Tên field liên kết với User
            select: "_id name avatar", // Chọn các trường cần thiết
        })
        .populate({
            path: "updater_id", // Tên field liên kết với User
            select: "_id name avatar", // Chọn các trường cần thiết
        });
    // Map lại để thêm LINK_STATIC_URL vào từng ảnh của course và avatar của creator
    const coursesEdit = courses.map((course) => {
        const creator = course.creator_id; // Lấy thông tin của creator
        const updater = course.updater_id; // Lấy thông tin của updater
        let images_src = [];
        return {
            ...course._doc,
            images_src: (images_src = course.images.map((img) => LINK_STATIC_URL + img)),
            image_featured: _.isNumber(course.image_featured) && images_src[course.image_featured],
            creator: {
                _id: creator?._id,
                name: creator.name,
                avatar: creator.avatar ? LINK_STATIC_URL + creator.avatar : null, // Thêm LINK_STATIC_URL vào avatar
            },
            updater: {
                _id: updater._id,
                name: updater.name,
                avatar: updater.avatar ? LINK_STATIC_URL + creator.avatar : null, // Thêm LINK_STATIC_URL vào avatar
            },
        };
    });

    const total = await Course.countDocuments(filter);
    return {total, page, per_page, courses: coursesEdit};
}

export async function getListCourseForUser({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
    };

    // Chuyển sort_order thành giá trị số
    const sortOrderValue = sort_order === "desc" ? -1 : 1;

    // Truy vấn để lấy danh sách Course
    const courses = await Course.aggregate([
        {$match: filter},
        {$sort: {[field]: sortOrderValue}}, // Sắp xếp theo trường được cung cấp và thứ tự
        {$skip: (page - 1) * per_page},
        {$limit: per_page},
        {
            $lookup: {
                from: "classes", // Bảng Class
                localField: "_id", // Khóa chính của Course (_id)
                foreignField: "course_id", // Khóa ngoại course_id trong Class
                as: "classes_info", // Kết quả sẽ được lưu vào trường "classes_info"
            },
        },
    ]);

    // Xử lý các kết quả, thêm URL tĩnh vào các hình ảnh
    const coursesEdit = courses.map((pkg) => {
        let images_src = [];
        return {
            ...pkg,
            images_src: (images_src = pkg.images.map((img) => LINK_STATIC_URL + img)),
            image_featured: _.isNumber(pkg.image_featured) && images_src[pkg.image_featured],
            classes: pkg.classes_info
                .map((classItem) => ({
                    _id: classItem._id,
                    name: classItem.name,
                    code: classItem.code,
                    start_time: classItem.start_time,
                    end_time: classItem.end_time,
                    deleted: classItem.deleted,
                }))
                .filter((classItem) => !classItem.deleted), // Lọc các lớp không bị xóa
        };
    });

    const total = await Course.countDocuments(filter);

    return {
        total,
        page,
        per_page,
        courses: coursesEdit,
    };
}

// Chi tiết
export async function getDetailsCourse(courseId) {
    const courseDetails = await Course.findOne({ _id: courseId, deleted: false });

    if (!courseDetails) return null;

    // Gán đường dẫn cho file và ảnh
    courseDetails.file_record = courseDetails.file_record ? LINK_STATIC_URL + courseDetails.file_record : null;
    courseDetails.images = courseDetails.images.map((img) => LINK_STATIC_URL + img);

    // Lấy các lớp thể thao có course_id bằng courseId
    const classes = await Class.find({ course_id: courseId, deleted: false }).lean();

    // Kiểm tra nếu không có lớp nào, gán classes là null
    if (classes.length === 0) {
        return {
            ...courseDetails.toObject(),
            classes: null, // Không có lớp nào, gán null cho classes
        };
    }

    // Duyệt qua từng lớp để lấy thông tin huấn luyện viên
    for (const classItem of classes) {
        if (classItem.teacher_id) {
            // Tìm huấn luyện viên có _id bằng với teacher_id của lớp
            const teacher = await Admin.findOne({ _id: classItem.teacher_id, deleted: false }).lean();

            // Nếu tìm thấy huấn luyện viên, thêm vào thông tin huấn luyện viên và xử lý avatar
            if (teacher) {
                classItem.teacher = {
                    _id: teacher._id,
                    name: teacher.name,
                    avatar: teacher.avatar ? LINK_STATIC_URL + teacher.avatar : null,
                };
            } else {
                classItem.teacher = null; // Nếu không tìm thấy huấn luyện viên, gán null
            }
        } else {
            classItem.teacher = null; // Nếu không có teacher_id, gán null
        }
    }

    return {
        ...courseDetails.toObject(),
        classes, // Trả về danh sách các lớp hoặc null nếu không có lớp nào
    };
}


export async function create(
    {name, description, images, image_featured, start_time, end_time, original_price, current_price},
    creator_id,
) {
    const lastCourse = await Course.findOne().sort({code: -1});
    let newCode = "C001";

    if (lastCourse) {
        const lastCode = lastCourse.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `C${numberPart.toString().padStart(3, "0")}`;
    }

    images = await Promise.all(images.map((img) => img.save("images/courses")));

    const course = new Course({
        code: newCode,
        name,
        creator_id: creator_id._id,
        updater_id: creator_id._id,
        description,
        images,
        image_featured: images.length > 0 && _.isNumber(image_featured) ? image_featured : null,
        original_price,
        current_price,
        start_time,
        end_time,
        status: STATUS_ACTIVE.UNLOCK,
    });

    await course.save();

    return course;
}

export async function update(
    course,
    {name, description, images, image_featured, original_price, current_price, start_time, end_time, status},
    updater,
) {
    const keepImages = course.images.filter((img) => images.includes(img));
    const removeImages = course.images.filter((img) => !images.includes(img));

    images = images.filter((img) => img instanceof FileUpload).map((img) => img.save("images/courses"));

    const newImages = await Promise.all(images);

    for (const img of removeImages) {
        FileUpload.remove(img);
    }

    course.name = name;
    course.description = description;
    course.images = [...keepImages, ...newImages];
    course.image_featured = course.images.length > 0 && _.isNumber(image_featured) ? image_featured : null;
    course.start_time = start_time;
    course.end_time = end_time;
    course.current_price = current_price;
    course.original_price = original_price;
    course.updater_id = updater._id;
    course.status = status;

    const updateCourse = await course.save();
    console.log("🌈 ~ updateCourse:", updateCourse);

    return course;
}

export async function remove(pkg) {
    // Đánh dấu khóa tập là đã xóa
    pkg.deleted = true;
    await pkg.save();

    // Tìm tất cả lớp thể thao có course_id bằng với pkg._id
    const classes = await Class.find({ course_id: pkg._id });

    // Lấy ra mảng các _id của lớp thể thao
    const classIds = classes.map((cls) => cls._id);

    // Xóa các bản ghi trong bảng Score có class_id nằm trong mảng classIds
    await Score.deleteMany({ class_id: { $in: classIds } });

    // Cập nhật deleted: true cho các lớp thể thao có course_id bằng pkg._id
    await Class.updateMany({ _id: { $in: classIds } }, { deleted: true });

    return { message: "Classes and related scores have been processed." };
}


export async function highlightedItem(pkg) {
    await Course.updateMany({deleted: false}, {is_highlight: false});
    await Course.updateOne({_id: pkg._id}, {is_highlight: true});
}

// Lấy những lớp thể thao thuộc khóa tập
export async function getViewClassOf(courseId) {
    const courseDetails = await Course.findOne({ _id: courseId, deleted: false });

    if (!courseDetails) return null;

    // Gán đường dẫn cho file và ảnh
    courseDetails.file_record = courseDetails.file_record ? LINK_STATIC_URL + courseDetails.file_record : null;
    courseDetails.images = courseDetails.images.map((img) => LINK_STATIC_URL + img);

    // Lấy các lớp thể thao có course_id bằng courseId
    const classes = await Class.find({ course_id: courseId, deleted: false }).lean();

    // Kiểm tra nếu không có lớp nào, gán classes là null
    if (classes.length === 0) {
        return {
            ...courseDetails.toObject(),
            classes: null, // Không có lớp nào, gán null cho classes
        };
    }

    // Duyệt qua từng lớp để lấy thông tin huấn luyện viên và hội viên
    for (const classItem of classes) {
        // Lấy thông tin huấn luyện viên nếu có teacher_id
        if (classItem.teacher_id) {
            const teacher = await Admin.findOne({ _id: classItem.teacher_id, deleted: false }).lean();

            // Nếu tìm thấy huấn luyện viên, thêm vào thông tin huấn luyện viên và xử lý avatar
            if (teacher) {
                classItem.teacher = {
                    _id: teacher._id,
                    name: teacher.name,
                    email: teacher.email,
                    avatar: teacher.avatar ? LINK_STATIC_URL + teacher.avatar : null,
                };
            } else {
                classItem.teacher = null; // Nếu không tìm thấy huấn luyện viên, gán null
            }
        } else {
            classItem.teacher = null; // Nếu không có teacher_id, gán null
        }

        // Lấy thông tin hội viên dựa trên student_ids
        if (classItem.student_ids && classItem.student_ids.length > 0) {
            const students = await User.find({ _id: { $in: classItem.student_ids }, deleted: false })
                .select("_id name email avatar address phone gender code")
                .lean();

            // Xử lý avatar cho từng hội viên
            classItem.student_of_class = students.map((student) => ({
                ...student,
                avatar: student.avatar ? LINK_STATIC_URL + student.avatar : null,
            }));
        } else {
            classItem.student_of_class = []; // Nếu không có hội viên, trả về mảng rỗng
        }
    }

    return {
        ...courseDetails.toObject(),
        classes, // Trả về danh sách các lớp
    };
}


// export async function getListCourse({q, page, per_page, field, sort_order}) {
//     q = q ? {$regex: q, $options: "i"} : null;

//     const filter = {
//         ...(q && {$or: [{name: q}, {code: q}]}),
//         deleted: false,
//     };

//     // Sử dụng populate để lấy thông tin của creator
//     const courses = await Course.find(filter)
//         .skip((page - 1) * per_page)
//         .limit(per_page)
//         .sort({[field]: sort_order})
//         .populate({
//             path: "creator_id", // Tên field liên kết với User
//             select: "_id name avatar", // Chọn các trường cần thiết
//         })
//         .populate({
//             path: "updater_id", // Tên field liên kết với User
//             select: "_id name avatar", // Chọn các trường cần thiết
//         })
//         ;

//     // Map lại để thêm LINK_STATIC_URL vào từng ảnh của course và avatar của creator
//     const coursesEdit = courses.map((course) => {
//         const creator = course.creator_id; // Lấy thông tin của creator
//         const updater = course.updater_id; // Lấy thông tin của updater
//         let images_src = [];
//         return {
//             ...course._doc,
//             images_src: images_src = course.images.map((img) => LINK_STATIC_URL + img),
//             image_featured:
//             _.isNumber(course.image_featured) && images_src[course.image_featured],
//             creator: {
//                 _id: creator._id,
//                 name: creator.name,
//                 avatar: creator.avatar ? LINK_STATIC_URL + creator.avatar : null, // Thêm LINK_STATIC_URL vào avatar
//             },
//             updater: {
//                 _id: updater._id,
//                 name: updater.name,
//                 avatar: updater.avatar ? LINK_STATIC_URL + creator.avatar : null, // Thêm LINK_STATIC_URL vào avatar
//             }
//         };
//     });

//     const total = await Course.countDocuments(filter);
//     return {total, page, per_page, courses: coursesEdit};
// }
