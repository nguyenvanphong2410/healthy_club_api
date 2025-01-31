import moment from "moment";
import jwt from "jsonwebtoken";
import {Admin, Order, Course, User} from "../models";
import {
    ACCOUNT_TYPE,
    cache,
    CHANGE_PASSWORD_EXPIRES_IN,
    JWT_EXPIRES_IN,
    LINK_STATIC_URL,
    PACKAGE_TYPE,
    STATUS_ACTIVE,
    STATUS_ORDER_TYPE,
    TOKEN_TYPE,
} from "@/configs";
import {FileUpload} from "@/utils/types";
import {
    comparePassword,
    decodeNum,
    generatePassword,
    generateToken,
    generateCodeOrder,
} from "@/utils/helpers";
import {capitalizeName} from "@/utils/helpers/name.helper";
import { Class } from "../models/class";

export const tokenBlocklist = cache.create("token-block-list");
export const userChangePasswordList = cache.create("user-change-password-list");
export const emailForgotPasswordList = cache.create("email-forgot-password-list");

export async function checkValidUserLogin({email, password}) {
    const user = await User.findOne({
        email: email,
        deleted: false,
        status: STATUS_ACTIVE.ACTIVE,
    });

    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            user.account_type = ACCOUNT_TYPE.USER;
            return user;
        }
    }

    return false;
}

export async function checkValidAdminLogin({email, password}) {
    const admin = await Admin.findOne({
        email,
        deleted: false,
        status: STATUS_ACTIVE.ACTIVE,
    });

    if (admin) {
        const verified = comparePassword(password, admin.password);
        if (verified) {
            admin.account_type = ACCOUNT_TYPE.ADMIN;
            return admin;
        }
    }

    return false;
}

export function authToken(account_id, account_type) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, {account_id, account_type}, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}


export async function temporarySaveUserChangePassword(phone) {
    const expire = CHANGE_PASSWORD_EXPIRES_IN;

    await userChangePasswordList.set(phone, 1, expire);

    const currentTime = moment();
    return {
        expired: currentTime.add(expire, "seconds"),
    };
}

export async function profile(account) {
    let result;
    switch (account.account_type) {
        case ACCOUNT_TYPE.USER: {
            // Tạo block scope cho case này
            result = await User.findOne({_id: account._id}, {password: 0, deleted: 0});
            result.avatar = result.avatar ? LINK_STATIC_URL + result.avatar : null;

            // Tìm các gói (Course) mà user là hội viên
            const userCourses = await Course.find(
                {
                    student_of_course: account._id, // Kiểm tra nếu user nằm trong mảng student_of_course
                    deleted: false,
                },
                {
                    code: 1,
                    name: 1,
                    start_time: 1,
                    end_time: 1,
                    description: 1,
                    original_price: 1,
                    current_price: 1,
                    // Các trường cần lấy
                },
            );
            // Tìm các gói (Course) mà user là hội viên
            const userClass = await Class.find(
                {
                    student_ids: account._id, // Kiểm tra nếu user nằm trong mảng
                    deleted: false,
                },
                {
                    code: 1,
                    name: 1,
                    // Các trường cần lấy
                },
            );

            result = {...result.toObject(), point: decodeNum(result.point), userCourses, userClass};
            break;
        }
        case ACCOUNT_TYPE.ADMIN: {
            // Tạo block scope cho case này
            result = await Admin.aggregate([
                {
                    $match: {_id: account._id, deleted: false},
                },
                {
                    $lookup: {
                        from: "roles",
                        localField: "role_ids",
                        foreignField: "_id",
                        as: "roles",
                    },
                },
                {
                    $lookup: {
                        from: "permissions",
                        localField: "roles.permission_ids",
                        foreignField: "_id",
                        as: "permissions",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        code: 1,
                        name: 1,
                        email: 1,
                        avatar: {
                            $cond: {
                                if: {$ifNull: ["$avatar", false]},
                                then: {$concat: [LINK_STATIC_URL, "$avatar"]},
                                else: null,
                            },
                        },
                        deleted: 1,
                        phone: 1,
                        address: 1,
                        gender: 1,
                        status: 1,
                        confirmed_at: 1,
                        permissions: "$permissions.code",
                        user_type: 1,
                    },
                },
            ]);
            result = result["0"] || null;
            break;
        }
    }

    return result;
}

export async function updateProfile(currentUser, {name, email, phone, avatar}) {
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    if (avatar) {
        if (currentUser.avatar) {
            FileUpload.remove(currentUser.avatar);
        }
        avatar = avatar.save("images");
        currentUser.avatar = avatar;
    }

    return await currentUser.save();
}

export async function updateInfo(currentUser, {name, avatar, phone, address, gender}) {
    console.log("🌈 ~ updateInfo ~ avatar:", avatar);

    if (avatar) {
        if (currentUser.avatar) {
            FileUpload.remove(currentUser.avatar);
        }
        currentUser.avatar = avatar === "delete" ? "" : avatar.save("images/avatars");
    }

    currentUser.name = name ? capitalizeName(name) : null;
    currentUser.phone = phone;
    currentUser.address = address;
    currentUser.gender = gender;

    return await currentUser.save();
}

export async function resetPassword(account, new_password) {
    account.password = generatePassword(new_password);
    await account.save();
    return account;
}

export async function registerUser(req) {
    let user = req.userRegister;
    const {phone, password} = req.body;

    if (user) {
        user.password = generatePassword(password);
    } else {
        user = new User({
            password: generatePassword(password),
            phone,
            point: 0,
            confirmed: false,
            status: STATUS_ACTIVE.ACTIVE,
        });
    }

    return await user.save();
}

export async function activate(user) {
    user.point = 0;

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
            time: new Date(),
            status: STATUS_ORDER_TYPE.COMPLETE,
        });

        await order.save();
        user.point = pkg.point;
    }

    user.confirmed = true;
    await user.save();

    return authToken(user._id, ACCOUNT_TYPE.USER);
}

export async function register({name, email, password, phone, gender}) {
    const lastCourse = await User.findOne().sort({code: -1});
    let newCode = "CR000001";

    if (lastCourse) {
        const lastCode = lastCourse.code;
        const numberPart = parseInt(lastCode.slice(2), 10) + 1;
        newCode = `CR${numberPart.toString().padStart(6, "0")}`;
    }
    const userRegister = new User({
        code: newCode,
        name,
        email,
        password: generatePassword(password),
        phone,
        gender,
        point: 0,
        confirmed: true,
    });
    return await userRegister.save();
}
