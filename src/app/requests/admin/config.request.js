import {Config} from "@/app/models";
import {BANK_TEMPLATE_OPTIONS, CONFIG_TYPE} from "@/configs";
import {AsyncValidate, FileUpload} from "@/utils/types";
import Joi from "joi";

export const updateBank = Joi.object({
    bank_id: Joi.string().required().label("Mã ngân hàng"),
    account_no: Joi.string().required().label("Số tài khoản"),
    template: Joi.string()
        .valid(...Object.values(BANK_TEMPLATE_OPTIONS))
        .required()
        .label("Template"),
    account_name: Joi.string().required().label("Tên chủ sở hữu"),
});

export const updateLark = Joi.object({
    app_id: Joi.string().required().label("App ID"),
    app_secret: Joi.string().required().label("App Secret"),
    group_id: Joi.string().required().label("Group ID"),
    oauth_url: Joi.string().required().label("OAuth Url"),
    message_url: Joi.string().required().label("Message Url"),
});

export const updateZentSMS = Joi.object({
    url: Joi.string().required().label("URL"),
    app_key: Joi.string().required().label("Khóa bí mật"),
    template_register: Joi.string().required().label("Nội dung tin nhắn đăng ký"),
    template_forgot_password: Joi.string().required().label("Nội dung tin nhắn quên mật khẩu"),
});

export const updateNumerology = Joi.object({
    token: Joi.string().required().label("Token"),
    name_based_on_birth_api: Joi.string().required().label("URL gợi ý tên đẹp"),
    compatibility_by_birth_and_name_api: Joi.string().required().label("URL xem tên phù hợp với con"),
});

export const updateContact = Joi.object({
    email: Joi.string().email().required().label("Email"),
    phone: Joi.string()
        .pattern(/^[0-9]{8,}$/)
        .required()
        .label("Số điện thoại"),
    socials: Joi.array()
        .items({
            icon: Joi.alternatives().try(
                Joi.object({
                    originalname: Joi.string().trim().required().label("Tên ảnh"),
                    mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
                        .required()
                        .label("Định dạng ảnh"),
                    buffer: Joi.binary().label("Icon"),
                })
                    .instance(FileUpload)
                    .required()
                    .label("File icon"),
                Joi.string()
                    .trim()
                    .required()
                    .label("Url icon")
                    .custom(
                        (value, helpers) =>
                            new AsyncValidate(value, async function (req) {
                                const config = req.contact?.config;
                                if (config) {
                                    const index = helpers.state.path[helpers.state.path.length - 2];
                                    if (config?.socials?.[index]?.icon) {
                                        return value;
                                    }
                                }
                                return helpers.error("any.invalid");
                            }),
                    ),
            ),
            link: Joi.string().required().label("Liên kết"),
        })
        .default([])
        .label("Mạng xã hội"),
});

export const checkConfigContact = async (req, res, next) => {
    req.contact = await Config.findOne({type: CONFIG_TYPE.CONTACT});
    return next();
};
