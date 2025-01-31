import {User} from "@/app/models";
import {MAX_STRING_SIZE, STATUS_ACTIVE, VALIDATE_PHONE_REGEX} from "@/configs";
import {GENDER} from "@/utils/helpers/constants";
import {validateName} from "@/utils/helpers/name.helper";
import {AsyncValidate, FileUpload} from "@/utils/types";
import Joi from "joi";

export const create = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).allow("").label("Họ và tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpg", "image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow(null, "")
        .label("Ảnh đại diện"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .allow("")
        .email()
        .label("Email")
        .custom((value, helpers) => {
            if (!value) return value;
            return new AsyncValidate(value, async function () {
                const account = await User.findOne({email: value, deleted: false});
                return !account ? value : helpers.error("any.exists");
            });
        }),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required()
        .label("Giới tính"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const account = await User.findOne({phone: value, deleted: false});
                    return !account ? value : helpers.error("any.exists");
                }),
        ),
    address: Joi.string().allow(null, "").label("Địa chỉ"),
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    status: Joi.number().valid(STATUS_ACTIVE.ACTIVE, STATUS_ACTIVE.INACTIVE).required().label("Trạng thái"),
});

export const update = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).allow("").label("Họ và tên"),
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
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .allow("")
        .email()
        .label("Email")
        .custom((value, helpers) => {
            if (!value) return value;
            return new AsyncValidate(value, async function (req) {
                const account = await User.findOne({email: value, deleted: false, _id: {$ne: req.user._id}});
                return !account ? value : helpers.error("any.exists");
            });
        }),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required()
        .label("Giới tính"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom((value, helpers) => {
            if (!value) return value;
            return new AsyncValidate(value, async function (req) {
                const account = await User.findOne({phone: value, deleted: false, _id: {$ne: req.user._id}});
                return !account ? value : helpers.error("any.exists");
            });
        }),
    address: Joi.string().allow(null, "").label("Mật khẩu"),
    status: Joi.number().valid(STATUS_ACTIVE.ACTIVE, STATUS_ACTIVE.INACTIVE).required().label("Trạng thái"),
});

export const changeStatus = Joi.object({
    status: Joi.number().valid(STATUS_ACTIVE.ACTIVE, STATUS_ACTIVE.INACTIVE).required().label("Trạng thái"),
});

export const changePassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});
