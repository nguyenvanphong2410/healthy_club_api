import Joi from "joi";
import {tryValidateOrDefault} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";
import {AsyncValidate} from "@/utils/types";
import {ObjectId, Course} from "@/app/models";
import {STATUS_ORDER_TYPE} from "@/configs";

export const getOrderHistories = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), null),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(
        Joi.valid(
            "created_at",
            "code",
            "course_name",
            "course_point",
            "course_current_price",
            "course_original_price",
        ),
        "created_at",
    ),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
    course_id: Joi.string().allow(null).label("ID gói nạp").custom((value, helpers) =>
        new AsyncValidate(value, async function () {
            if (!isValidObjectId(value)) {
                return helpers.error("any.invalid");
            }
            const existCourse = await Course.findOne({_id: new ObjectId(value)});
            return existCourse ? value : helpers.error("any.not-exists");
        }),
    ),
    status: tryValidateOrDefault(Joi.number().integer().valid(...Object.values(STATUS_ORDER_TYPE)), null)
});

export const getTransactions = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), null),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(
        Joi.valid(
            "created_at",
            "service_name",
            "service_code",
        ),
        "created_at",
    ),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
    service_code: tryValidateOrDefault(Joi.string().allow(null), null),
    service_name: tryValidateOrDefault(Joi.string().allow(null), null),
});
