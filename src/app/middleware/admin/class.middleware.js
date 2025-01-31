import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";

import { Class } from "@/app/models/class";
import { Course } from "@/app/models";

export const checkClass = async function (req, res, next) {
    const _id = req.params.id;

    if (!isValidObjectId(_id)) {
        return responseError(res, 400, "Lớp thể thao không hợp lệ.");
    }

    const classes = await Class.findOne({_id, deleted: false});

    if (!classes) {
        return responseError(res, 404, "Lớp thể thao không tồn tại hoặc đã bị xóa.");
    }

    req.class = classes;

    return next();
};

export const checkCourse = async function (req, res, next) {
    const courseIds = req.body.course_id;

    if (!Array.isArray(courseIds) || courseIds?.some((id) => !isValidObjectId(id))) {
        return responseError(res, 400, "Danh mục không hợp lệ.");
    }

    const courses = await Course.find({
        _id: {$in: courseIds},
        deleted: false,
    });

    if (courses.length !== courseIds.length) {
        return responseError(res, 404, "Danh mục không tồn tại.");
    }

    return next();
};
