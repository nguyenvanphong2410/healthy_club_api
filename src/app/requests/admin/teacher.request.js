import Joi from "joi";
import {MAX_STRING_SIZE, STATUS_ACTIVE, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {validateName} from "@/utils/helpers/name.helper";
import {GENDER} from "@/utils/helpers/constants";
import {Admin} from "@/app/models";

//Huấn luyện viên
export const createTeacher = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
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
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const teacher = await Admin.findOne({email: value, deleted: false});
                    return !teacher ? value : helpers.error("any.exists");
                }),
        ),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required()
        .label("Giới tính"),
    address: Joi.string().allow(null, "").label("Địa chỉ"),
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    if (value) {
                        const teacher = await Admin.findOne({phone: value, deleted: false});
                        return !teacher ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
    role_ids: Joi.array().label("Id role"),
});

export const updateTeacher = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
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
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const teacherId = req.teacher._id;
                    const teacher = await Admin.findOne({email: value, deleted: false, _id: {$ne: teacherId}});
                    return !teacher ? value : helpers.error("any.exists");
                }),
        ),
    gender: Joi.string()
        .valid(...Object.values(GENDER))
        .required()
        .label("Giới tính"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const teacherId = req.teacher._id;
                    const teacher = await Admin.findOne({phone: value, deleted: false, _id: {$ne: teacherId}});
                    return !teacher ? value : helpers.error("any.exists");
                }),
        ),
    address: Joi.string().allow(null, "").label("Mật khẩu"),
    status: Joi.number().valid(STATUS_ACTIVE.ACTIVE, STATUS_ACTIVE.INACTIVE).required().label("Trạng thái"),
    role_ids: Joi.array().label("Trạng thái"),
});

export const changeStatus = Joi.object({
    status: Joi.number().valid(STATUS_ACTIVE.ACTIVE, STATUS_ACTIVE.INACTIVE).required().label("Trạng thái"),
});

export const changePassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

