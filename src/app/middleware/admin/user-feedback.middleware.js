import {UserFeedback} from "@/app/models";
import {responseError} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";

export async function checkUserFeedbackId(req, res, next) {
    if (isValidObjectId(req.params.userFeedbackId)) {
        const userFeedback = await UserFeedback.findOne({_id: req.params.userFeedbackId, deleted: false});
        if (userFeedback) {
            req.userFeedback = userFeedback;
            return next();
        }
    }

    return responseError(res, 404, "Nhận xét của hội viên không tồn tại.");
}
