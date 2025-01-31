import Joi from "joi";
import {MAX_STRING_SIZE} from "@/configs";
import {FileUpload} from "@/utils/types";
import moment from "moment";
import _ from "lodash";
import {tryValidateOrDefault} from "@/utils/helpers";
import {MAX_SIZE_NAME} from "@/utils/helpers/constants";

export const getListCourseRequest = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tên gói"),
    description: Joi.string().trim().max(1500).required().label("Mô tả"),
    original_price: Joi.number().integer().min(1).required().label("Giá tiền gốc"),
    current_price: Joi.number().integer().min(1).required().label("Giá tiền hiện tại"),
    images: Joi.array()
        .single()
        .items(
            Joi.object({
                originalname: Joi.string().trim().required().label("Tên ảnh"),
                mimetype: Joi.valid("image/jpg", "image/jpeg", "image/png", "image/svg+xml", "image/webp")
                    .required()
                    .label("Định dạng ảnh"),
                buffer: Joi.binary()
                    .required()
                    .label("Kích thước ảnh")
                    .max(10000000)
                    .messages({"binary.max": "{{#label}} không được vượt quá 10mb."}),
            })
                .instance(FileUpload)
                .allow(null, "")
                .label("Ảnh mô tả"),
        )
        .default([])
        .max(3)
        .label("Ảnh mô tả"),
    image_featured: Joi.number()
        .integer()
        .min(0)
        .allow(null, "")
        .label("Ảnh nổi bật")
        .custom((value, helpers) => {
            const images = helpers.prefs.context.data.images;
            if (_.isArray(images) && images.length > 0) {
                return value < images.length ? value : helpers.error("any.invalid");
            } else {
                return value;
            }
        }),
    start_time: Joi.date()
        .required()
        .label("Thời gian bắt đầu")
        .custom((value, helpers) =>
            value > moment().unix() ? value : helpers.message("{{#label}} phải lớn hơn thời gian hiện tại."),
        ),
    end_time: Joi.date()
        .greater(Joi.ref("start_time"))
        .required()
        .label("Thời gian kết thúc")
        .messages({"number.greater": "{{#label}} phải lớn hơn thời gian bắt đầu."}),
});
export const updateItem = Joi.object({
    name: Joi.string()
        .trim()
        .max(MAX_SIZE_NAME)
        .required()
        .label("Tên khóa tập"),
    images: Joi.array()
        .single()
        .items(
            Joi.object({
                originalname: Joi.string().trim().required().label("Tên ảnh"),
                mimetype: Joi.valid("image/jpg", "image/jpeg", "image/png", "image/svg+xml", "image/webp")
                    .required()
                    .label("Định dạng ảnh"),
                buffer: Joi.binary()
                    .required()
                    .label("Kích thước ảnh")
                    .max(10000000)
                    .messages({"binary.max": "{{#label}} không được vượt quá 10mb."}),
            })
                .instance(FileUpload)
                .allow(null, "")
                .label("Ảnh mô tả"),
            Joi.string().trim(),
        )
        .max(3)
        .default([])
        .label("Ảnh mô tả"),
    image_featured: Joi.number()
        .integer()
        .min(0)
        .allow(null, "")
        .label("Ảnh nổi bật")
        .custom((value, helpers) => {
            const images = helpers.prefs.context.data.images;
            if (_.isArray(images) && images.length > 0) {
                return value < images.length ? value : helpers.error("any.invalid");
            } else {
                return value;
            }
        }),
    description: Joi.string().trim().allow(null, "").label("Mô tả khóa tập"),
    start_time: Joi.any().required().label("Thời gian bắt đầu"),
    end_time: Joi.any().required().label("Thời gian kết thúc"),
    original_price: Joi.number().integer().min(1).required().label("Giá tiền gốc"),
    current_price: Joi.number().integer().min(1).required().label("Giá tiền hiện tại"),
    // status: Joi.string()
    //     .valid(...Object.values(STATUS_ACTIVE))
    //     .label("Trạng thái")
    //     .messages({"any.only": "Trạng thái không hợp lệ."}),
});
export const updateGiftItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Tên gói"),
    point: Joi.number().integer().min(1).required().label("Điểm"),
});
