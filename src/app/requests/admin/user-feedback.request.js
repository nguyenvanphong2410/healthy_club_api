import {FileUpload} from "@/utils/types";
import Joi from "joi";

export const createItem = Joi.object({
    cover: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh bìa"),
    })
        .instance(FileUpload)
        .label("Ảnh bìa")
        .required(),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .label("Ảnh đại diện")
        .required(),
    name: Joi.string().trim().max(60).required().label("Tên hội viên"),
    content: Joi.string().trim().max(500).required().label("Nhận xét"),
});

export const updateItem = Joi.object({
    cover: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh bìa"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh bìa")
        .required(),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện")
        .required(),
    name: Joi.string().trim().max(60).required().label("Tên hội viên"),
    content: Joi.string().trim().max(500).required().label("Nhận xét"),
});
