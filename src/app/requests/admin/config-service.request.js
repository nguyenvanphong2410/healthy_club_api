import Joi from "joi";

export const updateConfigService = Joi.object({
    config_services: Joi.array()
        .items({
            _id: Joi.string().label("ID"),
            name: Joi.string().required().label("Tên"),
            point: Joi.number().integer().required().min(0).label("Điểm"),
        })
        .required()
        .label("Cấu hình dịch vụ"),
});
