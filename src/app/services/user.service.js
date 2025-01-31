import {LINK_STATIC_URL, PACKAGE_TYPE, STATUS_ACTIVE, STATUS_ORDER_TYPE} from "@/configs";
import {Order, Course, User, Score, Admin} from "../models";
import {generateCodeOrder, generatePassword} from "@/utils/helpers";
import {FileUpload} from "@/utils/types";
import {Class} from "../models/class";

export async function create({
    name,
    email,
    gender,
    avatar,
    password,
    phone,
    address,
}) {
    const lastCourse = await User.findOne().sort({code: -1});
    let newCode = "CR000001";

    if (lastCourse) {
        const lastCode = lastCourse.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `CR${numberPart.toString().padStart(6, "0")}`;
    }
    if (avatar instanceof FileUpload) {
        avatar = avatar.save("images/user/avatars");
    }
    const user = new User({
        code: newCode,
        name,
        email,
        gender,
        phone,
        address,
        password: generatePassword(password),
        avatar,
        point: 0,
        confirmed: true,
    });

    const pkg = await Course.findOne({type: PACKAGE_TYPE.NEW_ACCOUNT_GIFT, deleted: false});
    if (pkg) {
        const checkCodeOrder = async (code) => {
            const result = await Order.findOne({code, deleted: false});
            if (result) {
                return await checkCodeOrder(generateCodeOrder(10));
            }
            return code;
        };

        const code = await checkCodeOrder(generateCodeOrder(10));

        const order = new Order({
            code: code,
            course_id: pkg._id,
            course_type: pkg.type,
            course_name: pkg.name,
            course_description: pkg.description,
            course_point: pkg.point,
            course_original_price: pkg.original_price,
            course_current_price: pkg.current_price,
            current_point: pkg.point,
            user_id: user._id,
            status: STATUS_ORDER_TYPE.COMPLETE,
        });

        await order.save();
        user.point = pkg.point;
    }
    await user.save();
    return user;
}

export async function getList({ q, page, per_page, field, sort_order, course_id_of_student, class_id_of_student }, userConfirmed) {
    q = q ? { $regex: q, $options: "i" } : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    let userIds = [];

    // Nếu course_id_of_student tồn tại, tìm hội viên trong khóa tập đó
    if (course_id_of_student) {
        const classesInCourse = await Class.find({ course_id: course_id_of_student, deleted: false });
        userIds = classesInCourse.reduce((ids, classItem) => {
            return ids.concat(classItem.student_ids);
        }, []);
    }

    // Nếu class_id_of_student tồn tại, tìm hội viên trong lớp thể thao đó
    if (class_id_of_student) {
        const classItem = await Class.findOne({ _id: class_id_of_student, deleted: false });
        if (classItem) {
            userIds = classItem.student_ids;
        }
    }

    // Nếu có course_id_of_student hoặc class_id_of_student nhưng không tìm thấy hội viên
    if ((course_id_of_student || class_id_of_student) && userIds.length === 0) {
        return {
            total: 0,
            page,
            per_page,
            users: [],
        };
    }

    const filter = {
        confirmed: userConfirmed === "confirmed" ? true : false,
        deleted: false,
        ...(q && { $or: [{ name: q }, { email: q }, { phone: q }] }),
        ...(userIds.length > 0 && { _id: { $in: userIds } }),
    };

    // Lấy danh sách hội viên
    const users = await User.find(filter, { password: 0, deleted: 0, confirmed: 0 });

    // Lấy thông tin các lớp thể thao mà hội viên tham gia
    const userWithClasses = await Promise.all(
        users.map(async (user) => {
            const classes = await Class.find({ student_ids: user._id, deleted: false });

            const courseAndClassOfStudent = await Promise.all(
                classes.map(async (classItem) => {
                    // Lấy thông tin khóa tập
                    const course = await Course.findOne({ _id: classItem.course_id, deleted: false });

                    // Lấy thông tin teacher của lớp thể thao
                    const teacher = await Admin.findOne({
                        _id: classItem.teacher_id,
                        user_type: "TEACHER",
                        deleted: false,
                    }).select("_id name avatar email");

                    const classWithTeacher = {
                        ...classItem.toObject(),
                        teacher: teacher
                            ? {
                                ...teacher.toObject(),
                                avatar: teacher.avatar
                                    ? `${LINK_STATIC_URL}${teacher.avatar}`
                                    : null,
                            }
                            : null,
                    };

                    return {
                        course,
                        class: [classWithTeacher], // Đảm bảo `class` là mảng chứa các lớp
                    };
                })
            );

            return {
                ...user.toObject(),
                avatar: user.avatar ? `${LINK_STATIC_URL}${user.avatar}` : null,
                courseAndClassOfStudent,
            };
        })
    );

    // Sắp xếp và phân trang
    const total = userWithClasses.length;
    const sortedUsers = userWithClasses.sort((a, b) => (a[field] < b[field] ? -sort_order : sort_order));
    const paginatedUsers = sortedUsers.slice((page - 1) * per_page, page * per_page);

    return {
        total,
        page,
        per_page,
        users: paginatedUsers,
    };
}


export async function getAllCustomer() {
    // Tìm tất cả người dùng có deleted: false và status: ACTIVE, sắp xếp theo createdAt mới nhất
    const users = await User.find({deleted: false, status: STATUS_ACTIVE.ACTIVE, confirmed: true}).sort({
        created_at: -1,
    }); // Sắp xếp theo thứ tự giảm dần của createdAt

    // Duyệt qua tất cả các bản ghi để kiểm tra avatar
    const processedUsers = users.map((user) => {
        return {
            ...user.toObject(), // Chuyển đổi Mongoose Document thành Plain Object
            avatar: user.avatar ? LINK_STATIC_URL + user.avatar : null, // Kiểm tra avatar và gắn link tĩnh
        };
    });

    // Trả về kết quả với danh sách người dùng
    return {users: processedUsers};
}

export async function details(userId) {
    const user = await User.findById(userId, {password: 0});
    user.avatar = LINK_STATIC_URL + user.avatar;
    return user;
}

export async function update(
    user,
    {
        name,
        email,
        gender,
        avatar,
        phone,
        address,
        status,
    },
) {
    if (avatar) {
        if (user.avatar) {
            FileUpload.remove(user.avatar);
        }
        user.avatar = avatar === "delete" ? "" : avatar.save("images/avatars");
    }

    user.name = name;
    user.email = email;
    user.gender = gender;
    user.phone = phone;
    user.address = address;
    user.status = status;

    await user.save();
    return user;
}

export async function resetPassword(user, new_password) {
    user.password = generatePassword(new_password);
    await user.save();
    return user;
}

export async function remove(user) {
    // Đánh dấu hội viên đã bị xóa
    user.deleted = true;
    await user.save();

    // Xóa hội viên khỏi các trường student_ids của Class
    await Class.updateMany({student_ids: user._id}, {$pull: {student_ids: user._id}});

    // Xóa hội viên khỏi các trường student_of_course của Course
    await Course.updateMany({student_of_course: user._id}, {$pull: {student_of_course: user._id}});

    // Xóa tất cả bản ghi trong bảng Score có class_id bằng classOf._id
    await Score.deleteMany({student_id: user._id});
}

export async function changeStatus(user, status) {
    user.status = status;
    await user.save();
}

export async function changePassword(user, password) {
    user.password = generatePassword(password);
    await user.save();
}
