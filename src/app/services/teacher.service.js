import {generatePassword} from "@/utils/helpers";
import {Admin, Course, Role} from "../models";
import {LINK_STATIC_URL, STATUS_ACTIVE} from "@/configs";
import {FileUpload} from "@/utils/types";
import {USER_TYPE} from "@/utils/helpers/constants";
import { Class } from "../models/class";

export async function updateProfile(teacher, {name, phone}) {
    teacher.name = name;
    teacher.phone = phone;

    return await teacher.save();
}

export async function create({name, email, password, phone, status, role_ids}) {
    const teacher = new Admin({
        name,
        email,
        phone: phone || null,
        password: generatePassword(password),
        status,
        is_teacher: true,
        role_ids: role_ids || null,
    });
    await teacher.save();
    return teacher;
}

export async function updateTeacher(
    teacher,
    {name, email, gender, avatar, phone, address, status, role_ids},
) {
    if (avatar) {
        if (teacher.avatar) {
            FileUpload.remove(teacher.avatar);
        }
        teacher.avatar = avatar === "delete" ? "" : avatar.save("images/avatars");
    }

    teacher.name = name;
    teacher.email = email;
    teacher.gender = gender;
    teacher.phone = phone || null;
    teacher.address = address;
    teacher.status = status;
    teacher.role_ids = role_ids || [];
    await teacher.save();
    return teacher;
}

export async function remove(teacher) {
    teacher.deleted = true;
    await teacher.save();
}

export async function changeStatus(teacher, status) {
    teacher.status = status;
    await teacher.save();
}

export async function changePassword(teacher, password) {
    teacher.password = generatePassword(password);
    await teacher.save();
}

export async function getList({ q, page, per_page, field, sort_order, course_id_of_teacher, class_id_of_teacher }, req) {
    const currentAccount = req.currentAccount;
    q = q ? { $regex: q, $options: "i" } : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    let teacherIds = [];

    // Nếu course_id_of_teacher tồn tại, tìm huấn luyện viên của khóa tập đó
    if (course_id_of_teacher) {
        const classesInCourse = await Class.find({ course_id: course_id_of_teacher, deleted: false });
        teacherIds = classesInCourse.map((cls) => cls.teacher_id.toString());
    }

    // Nếu class_id_of_teacher tồn tại, tìm huấn luyện viên của lớp thể thao đó
    if (class_id_of_teacher) {
        const classItem = await Class.findOne({ _id: class_id_of_teacher, deleted: false });
        if (classItem) {
            teacherIds = [classItem.teacher_id.toString()];
        }
    }

    // Nếu có course_id_of_teacher hoặc class_id_of_teacher nhưng không tìm thấy huấn luyện viên
    if ((course_id_of_teacher || class_id_of_teacher) && teacherIds.length === 0) {
        return {
            total: 0,
            page,
            per_page,
            admins: [],
        };
    }

    const filter = {
        _id: { $ne: currentAccount._id },
        deleted: false,
        user_type: USER_TYPE.TEACHER,
        ...(q && { $or: [{ name: q }, { email: q }, { phone: q }] }),
        ...(teacherIds.length > 0 && { _id: { $in: teacherIds } }),
    };

    // Lấy danh sách huấn luyện viên
    const admins = await Admin.find(filter, { password: 0, deleted: 0 })
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({ [field]: sort_order })
        .lean();

    // Lấy role
    const roleIds = admins.flatMap((admin) => admin.role_ids);
    const roles = await Role.find({ _id: { $in: roleIds } }, { _id: 1, name: 1 }).lean();
    const rolesMap = roles.reduce((acc, role) => {
        acc[role._id] = role;
        return acc;
    }, {});

    // Lấy danh sách lớp của từng huấn luyện viên
    const teacherIdsFromAdmins = admins.map((admin) => admin._id.toString());
    const classes = await Class.find(
        { teacher_id: { $in: teacherIdsFromAdmins }, deleted: false },
        {
            _id: 1,
            code: 1,
            name: 1,
            course_id: 1,
            teacher_id: 1,
            student_ids: 1,
        }
    ).lean();

    // Lấy thông tin khóa tập từ danh sách lớp
    const courseIds = classes.map((cls) => cls.course_id);
    const courses = await Course.find(
        { _id: { $in: courseIds }, deleted: false },
        {
            _id: 1,
            code: 1,
            name: 1,
            creator_id: 1,
            updater_id: 1,
            student_of_course: 1,
            description: 1,
            images: 1,
            start_time: 1,
            end_time: 1,
            original_price: 1,
            current_price: 1,
            is_highlight: 1,
            type: 1,
        }
    ).lean();

    // Gom các lớp theo khóa tập
    const courseMap = courses.reduce((acc, course) => {
        acc[course._id] = { ...course, class: [] };
        return acc;
    }, {});

    classes.forEach((cls) => {
        if (courseMap[cls.course_id]) {
            courseMap[cls.course_id].class.push(cls);
        }
    });

    // Gắn thông tin lớp và khóa tập vào từng huấn luyện viên
    const adminsWithCourseAndClass = admins.map((admin) => {
        // Quyền
        const populatedRoles = admin.role_ids?.map((roleId) => rolesMap[roleId] || roleId);

        const teacherClasses = classes.filter((cls) => cls.teacher_id.toString() === admin._id.toString());

        const courseAndClass = teacherClasses.reduce((acc, cls) => {
            const course = courseMap[cls.course_id];
            if (course) {
                const existing = acc.find((item) => item.course._id.toString() === course._id.toString());
                if (existing) {
                    existing.class.push(cls);
                } else {
                    acc.push({ course, class: [cls] });
                }
            }
            return acc;
        }, []);

        return {
            ...admin,
            role_ids: populatedRoles,
            avatar: admin.avatar ? LINK_STATIC_URL + admin.avatar : null,
            courseAndClass,
        };
    });

    const total = await Admin.countDocuments(filter);

    return { total, page, per_page, admins: adminsWithCourseAndClass };
}


//Huấn luyện viên
export async function createTeacher(req) {
    const lastCourse = await Admin.findOne({user_type: USER_TYPE.TEACHER}).sort({code: -1});
    let newCode = "CH000001";

    if (lastCourse) {
        const lastCode = lastCourse.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `CH${numberPart.toString().padStart(6, "0")}`;
    }
    const {password, ...data} = req.body;
    if (req.body.avatar instanceof FileUpload) {
        req.body.avatar = req.body.avatar.save("images/avatars");
    }
    const teacher = new Admin({
        ...data,
        code: newCode,
        password: generatePassword(password),
        status: STATUS_ACTIVE.ACTIVE,
        is_teacher: false,
        user_type: USER_TYPE.TEACHER,
    });
    await teacher.save();
    return teacher;
}

export async function getAllTeacher() {
    const teachers = await Admin.find({
        user_type: USER_TYPE.TEACHER,
        is_admin: false,
        deleted: false,
    }).sort({created_at: -1}); // Sắp xếp theo created_at giảm dần (mới nhất lên đầu)

    const updatedTeachers = teachers.map((teacher) => {
        if (teacher.avatar) {
            teacher.avatar = LINK_STATIC_URL + teacher.avatar;
        }
        return teacher;
    });

    return updatedTeachers;
}
