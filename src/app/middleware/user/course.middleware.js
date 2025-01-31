import {Course} from "@/app/models";
import { Class } from "@/app/models/class";
import {responseError} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";

export async function checkCourseId(req, res, next) {
    const {courseId} = req.params;
    if (isValidObjectId(courseId)) {
        const result = await Course.findOne({_id: courseId, deleted: false});
        if (result) {
            req.course = result;
            return next();
        }
    }
    return responseError(res, 404, "Khóa tập không tồn tại hoặc đã bị xoá.");
}

export async function checkClassOfCourseId(req, res, next) {
    const {classOfCourseId} = req.params;
    if (isValidObjectId(classOfCourseId)) {
        const result = await Class.findOne({_id: classOfCourseId, deleted: false});
        if (result) {
            req.classOfCourse = result;
            return next();
        }
    }
    return responseError(res, 404, "Lớp thể thao không tồn tại hoặc đã bị xoá.");
}
