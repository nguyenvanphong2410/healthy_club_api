import {User} from "@/app/models";
import {Class} from "@/app/models/class";
import {AsyncValidate} from "@/utils/types";
import Joi from "joi";

export const createOrUpdateScoreOfStudentRequest = Joi.object({
    student_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await User.findOne({
                        _id: value,
                        deleted: false,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Hội viên"),
    class_id: Joi.string()
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const course = await Class.findOne({
                        _id: value,
                        deleted: false,
                    });
                    return course ? value : helpers.error("any.not-exists");
                }),
        )
        .label("Lớp thể thao"),
    attendance_score: Joi.number().min(0).label("Điểm chuyên cần"),
    plus_score: Joi.number().min(0).label("Điểm cộng"),
    midterm_score: Joi.number().min(0).label("Điểm giữa kì"),
    final_score: Joi.number().min(0).label("Điểm cuối kì"),
});

export const updateScoreOfStudentRequest = Joi.object({
    attendance_score: Joi.number().min(0).label("Điểm chuyên cần"),
    plus_score: Joi.number().min(0).label("Điểm cộng"),
    midterm_score: Joi.number().min(0).label("Điểm giữa kì"),
    final_score: Joi.number().min(0).label("Điểm cuối kì"),
});

