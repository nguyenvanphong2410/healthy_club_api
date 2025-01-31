import Joi from "joi";
import {tryValidateOrDefault} from "@/utils/helpers";

export const getListCommentRequest = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createOrUpdateCommentRequest = Joi.object({
    content: Joi.string().trim().max(1000).label("Nội dung bình luận"),
});
