import {responseError} from "@/utils/helpers";
import { Admin } from "@/app/models";
import { isValidObjectId } from "mongoose";
import { USER_TYPE } from "@/utils/helpers/constants";

export const checkTeacherId = async function (req, res, next) {
    const _id = req.params.teacherId ;

    if (isValidObjectId(_id)) {
        const teacher = await Admin.findOne({_id, deleted: false, user_type: USER_TYPE.TEACHER});
        if (teacher) {
            req.teacher = teacher;
            return next();
        }
    }

    return responseError(res, 404, "Huấn luyện viên không tồn tại hoặc đã bị xóa.");
};
