import {Admin, Course, Score, User} from "@/app/models";
import {LINK_STATIC_URL} from "@/configs";
import _ from "lodash";
import {Class} from "../models/class";
import {USER_TYPE} from "@/utils/helpers/constants";

export async function getListMyCoursesDone({q, page, per_page, field, sort_order}, currentAccount) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
        student_of_course: currentAccount._id, // Lọc các khóa tập mà currentAccount._id đang tham gia
        start_time: {$lt: new Date()}, // Lọc những khóa có start_time nhỏ hơn thời gian hiện tại
        end_time: {$lt: new Date()}, // Lọc những khóa có end_time nhỏ hơn thời gian hiện tại
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

export async function getListMyCoursesInProgress({q, page, per_page, field, sort_order}, currentAccount) {
    q = q ? {$regex: q, $options: "i"} : null;

    const currentTime = new Date(); // Thời gian hiện tại

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
        student_of_course: currentAccount._id, // Lọc các khóa tập mà currentAccount._id đang tham gia
        start_time: {$lte: currentTime}, // Khóa đã bắt đầu
        end_time: {$gte: currentTime}, // Khóa chưa kết thúc
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

export async function getListMyCoursesPending({q, page, per_page, field, sort_order}, currentAccount) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {code: q}]}),
        deleted: false,
        student_of_course: currentAccount._id, // Lọc các khóa tập mà currentAccount._id đang tham gia
        start_time: {$gt: new Date()}, // Lọc những khóa có start_time nhỏ hơn thời gian hiện tại
        end_time: {$gt: new Date()}, // Lọc những khóa có end_time nhỏ hơn thời gian hiện tại
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

export async function getClassOfCourses(currentAccount, courseId) {
    // Kiểm tra nếu không có courseId thì trả về { data: null }
    if (!courseId) {
        return {data: null};
    }

    // Tìm lớp thể thao có course_id bằng courseId và currentAccount._id nằm trong student_ids
    const classFound = await Class.findOne({
        course_id: courseId,
        student_ids: currentAccount._id,
        deleted: false,
    }).lean();

    classFound.file_record = classFound.file_record !== null ? LINK_STATIC_URL + classFound.file_record : null;

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

    // Lấy điẻm me of class
    const myScore = await Score.findOne({
        class_id: classFound._id,
        student_id: currentAccount._id,
    }).lean();

    // Định dạng kết quả trả về
    return {
        data: {
            ...classFound,
            myScore,
            students, // Thêm danh sách hội viên vào object lớp thể thao
            teacher, // Thêm thông tin huấn luyện viên vào object lớp thể thao
        },
    };
}
