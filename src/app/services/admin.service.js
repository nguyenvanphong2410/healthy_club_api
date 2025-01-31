import {generatePassword} from "@/utils/helpers";
import {Admin, Role} from "../models";
import {LINK_STATIC_URL, PROTECTED} from "@/configs";
import {FileUpload} from "@/utils/types";
import {USER_TYPE} from "@/utils/helpers/constants";
import { capitalizeName } from "@/utils/helpers/name.helper";

export async function updateProfile(currentAccount, { name, avatar, phone, address, gender }) {
    if (avatar) {
        if (currentAccount.avatar) {
            FileUpload.remove(currentAccount.avatar);
        }
        currentAccount.avatar = avatar === "delete" ? "" : avatar.save("images/avatars");
    }

    currentAccount.name = name ? capitalizeName(name) : currentAccount.name;
    currentAccount.phone = phone;
    currentAccount.address = address;
    currentAccount.gender = gender ?? currentAccount.gender;

    // Kiểm tra các trường bắt buộc
    // currentAccount.code = currentAccount.code || null; // thay thế "Mã mặc định" nếu cần
    // currentAccount.user_type = currentAccount.user_type || null; // thay thế nếu cần

    return await currentAccount.save();
}

export async function create({name, email, gender, avatar, password, address, phone, status, role_ids}) {
    const lastCourse = await Admin.findOne({user_type: USER_TYPE.ADMIN}).sort({code: -1});
    let newCode = "AD000001";

    if (lastCourse) {
        const lastCode = lastCourse.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `AD${numberPart.toString().padStart(6, "0")}`;
    }
    if (avatar instanceof FileUpload) {
        avatar = avatar.save("images/user/avatars");
    }
    const admin = new Admin({
        code: newCode,
        name,
        email,
        gender,
        avatar,
        phone: phone || null,
        address,
        password: generatePassword(password),
        status,
        is_admin: true,
        role_ids: role_ids || [],
        user_type: USER_TYPE.ADMIN,
    });
    await admin.save();
    return admin;
}

export async function updateAdmin(admin, {name, email, gender, avatar, phone, address, status, role_ids}) {
    if (avatar) {
        if (admin.avatar) {
            FileUpload.remove(admin.avatar);
        }
        admin.avatar = avatar === "delete" ? "" : avatar.save("images/avatars");
    }

    admin.name = name;
    admin.email = email;
    admin.gender = gender;
    admin.phone = phone || null;
    admin.address = address;
    admin.status = status;
    admin.role_ids = role_ids || [];
    await admin.save();
    return admin;
}

export async function remove(admin) {
    admin.deleted = true;
    await admin.save();
}

export async function changeStatus(admin, status) {
    admin.status = status;
    await admin.save();
}

export async function changePassword(admin, password) {
    admin.password = generatePassword(password);
    await admin.save();
}

export async function getList({q, page, per_page, field, sort_order}, req) {
    const currentAccount = req.currentAccount;
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    const filter = {
        _id: {$ne: currentAccount._id},
        deleted: false,
        user_type: USER_TYPE.ADMIN,
        ...(q && {$or: [{name: q}, {email: q}, {phone: q}]}),
        protected: {$ne: PROTECTED.PROTECTED},
    };

    const admins = await Admin.find(filter, {password: 0, deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order})
        .lean();

    const roleIds = admins.flatMap((admin) => admin.role_ids);
    const roles = await Role.find({_id: {$in: roleIds}}, {_id: 1, name: 1}).lean();

    const rolesMap = roles.reduce((acc, role) => {
        acc[role._id] = role;
        return acc;
    }, {});

    const adminsWithRoles = admins.map((admin) => {
        const populatedRoles = admin.role_ids?.map((roleId) => rolesMap[roleId] || roleId);
        return {
            ...admin,
            role_ids: populatedRoles,
            avatar: admin.avatar ? LINK_STATIC_URL + admin.avatar : null,
        };
    });

    const total = await Admin.countDocuments(filter);
    return {total, page, per_page, admins: adminsWithRoles};
}
