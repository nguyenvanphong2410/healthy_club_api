import Joi from "joi";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {tryValidateOrDefault} from "@/utils/helpers";
import _ from "lodash";
import {MAX_SIZE_NAME, USER_TYPE} from "@/utils/helpers/constants";
import {Class} from "@/app/models/class";
import {Admin, Course, User} from "@/app/models";
import mongoose from "mongoose";

export const getListClassRequest = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(
        Joi.valid("created_at", "name", "quantity", "sale_price", "wholesale_price"),
        "created_at",
    ),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
    course_id: Joi.string().custom((value, helpers) => {
        // Kiểm tra xem course_id có phải là ObjectId hợp lệ hay không
        if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid"); // Trả về lỗi nếu không hợp lệ
        }
        return value; // Trả về giá trị nếu hợp lệ
    }),
}).unknown(true);

export const getListClassByCourseIdRequest = Joi.object({
    idsCourse: Joi.any().label("Các khóa tập"),
}).unknown(true);

export const createClassRequest = Joi.object({
    name: Joi.string()
        .trim()
        .max(MAX_SIZE_NAME)
        .required()
        .label("Tên tài liệu")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const employee = await Class.findOne({
                        name: value,
                        deleted: false,
                    });
                    return !employee ? value : helpers.error("any.exists");
                }),
        ),
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
    notes: Joi.string().allow(null, "").label("Mô tả"),
    file_record: Joi.any().allow(null, "").label("File tài liệu"),
    name_file: Joi.string().trim().label("Tên file"),
    max_number_student: Joi.number().min(0).allow(null, "").label("Số lượng hội viên tối đa"),
    course_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await Course.findOne({
                        _id: value,
                        deleted: false,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Khóa tập"),
    teacher_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await Admin.findOne({
                        _id: value,
                        deleted: false,
                        is_admin: false,
                        user_type: USER_TYPE.TEACHER,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Huấn luyện viên"),
    student_ids: Joi.array().items(
        Joi.string()
            .custom(
                (value, helpers) =>
                    new AsyncValidate(value, async function () {
                        const category = await User.findOne({
                            _id: value,
                            deleted: false,
                            // user_type: USER_TYPE.STUDENT,
                        });
                        return category ? value : helpers.error("any.not-exists");
                    }),
            )
            .label("Hội viên"),
    ),
});

export const updateClassRequest = Joi.object({
    name: Joi.string()
        .trim()
        .max(MAX_SIZE_NAME)
        .required()
        .label("Tên tài liệu")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const classId = req.params.id;
                    const classes = await Class.findOne({
                        name: value,
                        _id: {$ne: classId},
                        deleted: false,
                    });
                    return !classes ? value : helpers.error("any.exists");
                }),
        ),
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
                    .messages({"binary.max": "{{#label}} không vượt quá 10mb."}),
            })
                .instance(FileUpload)
                .allow(null, "")
                .label("Ảnh mô tả phòng"),
            Joi.string().trim(),
        )
        .max(3)
        .default([])
        .label("Ảnh mô tả phòng"),
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
    notes: Joi.string().allow(null, "").label("Mô tả"),
    file_record: Joi.any().allow(null, "").label("File tài liệu"),
    name_file: Joi.string().trim().label("Tên file"),
    max_number_student: Joi.number().min(0).allow(null, "").label("Số lượng hội viên tối đa"),
    course_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await Course.findOne({
                        _id: value,
                        deleted: false,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Danh mục"),
    teacher_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await Admin.findOne({
                        _id: value,
                        deleted: false,
                        // user_type: USER_TYPE.TEACHER,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Huấn luyện viên"),
    student_ids: Joi.array().items(
        Joi.string()
            .allow(null, "")
            .custom(
                (value, helpers) =>
                    new AsyncValidate(value, async function () {
                        const category = await User.findOne({
                            _id: value,
                            deleted: false,
                            // user_type: USER_TYPE.STUDENT,
                        });
                        return category ? value : helpers.error("any.not-exists");
                    }),
            )
            .label("Hội viên"),
    ),
});
