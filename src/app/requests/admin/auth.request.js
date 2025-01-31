import Joi from "joi";
import {MAX_STRING_SIZE, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {Admin} from "@/app/models";
import {comparePassword} from "@/utils/helpers";
import { GENDER } from "@/utils/helpers/constants";

export const login = Joi.object({
    email: Joi.string().trim().required().max(MAX_STRING_SIZE).label("Email"),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

export const updateProfile = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await Admin.findOne({
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

export const changePassword = Joi.object({
    password: Joi.string()
        .required()
        .label("Mật khẩu cũ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, (req) =>
                    comparePassword(value, req.currentAccount.password)
                        ? value
                        : helpers.message("{#label} không chính xác"),
                ),
        ),
    new_password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .required()
        .label("Mật khẩu mới")
        .invalid(Joi.ref("password")),
});

export const resetPassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu mới"),
});
