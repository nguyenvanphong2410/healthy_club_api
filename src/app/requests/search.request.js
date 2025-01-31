import {MAX_STRING_SIZE} from "@/configs";
import {validateName} from "@/utils/helpers/name.helper";
import Joi from "joi";
import moment from "moment";

export const search = {
    NAME_BASED_ON_BIRTH: Joi.object({
        birthday: Joi.string()
            .custom((value, helpers) => {
                const date = moment(value, "YYYY-MM-DD", true);

                if (!date.isValid() || date.format("YYYY-MM-DD") !== value) {
                    return helpers.error("date.not-exists");
                }

                return value;
            })
            .required()
            .label("Ngày sinh")
    }),
    COMPATIBILITY_BY_BIRTH_AND_NAME: Joi.object({
        birthday: Joi.string()
            .custom((value, helpers) => {
                const date = moment(value, "YYYY-MM-DD", true);

                if (!date.isValid() || date.format("YYYY-MM-DD") !== value) {
                    return helpers.error("date.not-exists");
                }

                return value;
            })
            .required()
            .label("Ngày sinh"),
        name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Tên của con"),
    }),
    AUSPICIOUS_YEAR_FOR_CHILDBIRTH: Joi.object({
        birthday_father: Joi.date().iso().required().label("Ngày sinh của bố"),
        birthday_mother: Joi.date().iso().required().label("Ngày sinh của mẹ"),
    }),
};
