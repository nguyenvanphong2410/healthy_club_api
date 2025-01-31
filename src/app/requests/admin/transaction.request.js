import { tryValidateOrDefault } from "@/utils/helpers";
import Joi from "joi";

export const getTransactions = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), null),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1), 20),
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
    start_time: tryValidateOrDefault(Joi.number().integer(), null),
    end_time: tryValidateOrDefault(Joi.number().integer(), null)
});