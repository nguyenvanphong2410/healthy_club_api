import Joi from "joi";
import {MAX_STRING_SIZE, VALIDATE_PHONE_REGEX} from "@/configs";
import {validateName} from "@/utils/helpers/name.helper";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {User} from "@/app/models";
import {GENDER, VALIDATE_PASSWORD_REGEX} from "@/utils/helpers/constants";

const customValidateEmail = (value, helpers) =>
    new AsyncValidate(value, async function () {
        const user = await User.findOne({email: value, deleted: false});
        return !user ? value : helpers.message("{{#label}} đã được đăng ký.");
    });
const customValidatePhone = (value, helpers) =>
    new AsyncValidate(value, async function () {
        const user = await User.findOne({phone: value, deleted: false});
        return !user ? value : helpers.message("{{#label}} đã được đăng ký.");
    });

export const updateMe = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await User.findOne({
                        phone: value,
                        deleted: false,
                        _id: {$ne: req.currentAccount._id},
                    });
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    address: Joi.string().trim().allow(null, "").max(255).label("Địa chỉ"),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .label("Giới tính"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .allow("", "delete")
        .instance(FileUpload)
        .label("Ảnh đại diện"),
});

export const login = Joi.object({
    email: Joi.string().trim().max(MAX_STRING_SIZE).lowercase().email().required().label("Email"),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

export const register = Joi.object({
    name: Joi.string().required().max(MAX_STRING_SIZE).custom(validateName).label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .required()
        .label("Email")
        .custom(customValidateEmail),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(customValidatePhone),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required()
        .label("Giới tính"),
    password: Joi.string()
        .min(6)
        .max(50)
        .pattern(VALIDATE_PASSWORD_REGEX)
        .required()
        .label("Mật khẩu")
        .messages({
            "string.pattern.base": "{{#label}} phải bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
        }),
});

export const activate = Joi.object({
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && account.confirmed) {
                        return helpers.error("any.activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.activateUser = account;
                    return value;
                }),
        )
        .label("Số điện thoại"),
    code: Joi.string()
        .length(6)
        .required()
        .label("Mã OTP"),
});

