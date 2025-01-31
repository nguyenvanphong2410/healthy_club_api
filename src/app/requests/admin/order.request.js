import {STATUS_ORDER_TYPE} from "@/configs";
import {tryValidateOrDefault} from "@/utils/helpers";
import Joi from "joi";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), null),
    status: tryValidateOrDefault(Joi.number().integer().valid(...Object.values(STATUS_ORDER_TYPE)), null),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(
        Joi.valid(
            "created_at",
            "code",
            "course_name",
            "course_point",
            "course_current_price",
            "status",
            "user",
        ),
        "created_at",
    ),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
    course_name: tryValidateOrDefault(Joi.array().single().items(Joi.string()), []),
});

export const changeStatus = Joi.object({
    status: Joi.valid(STATUS_ORDER_TYPE.COMPLETE, STATUS_ORDER_TYPE.CANCEL).required().label("Trạng thái"),
});
