import * as userFeedbackService from "@/app/services/user-feedback.service";
import {responseSuccess} from "@/utils/helpers";

export async function readRoot(req, res) {
    const result = await userFeedbackService.filter(req.query);
    return responseSuccess(res, result);
}

export async function createItem(req, res) {
    await userFeedbackService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateItem(req, res) {
    await userFeedbackService.update(req.userFeedback, req.body);
    return responseSuccess(res, null, 201);
}

export async function deleteItem(req, res) {
    await userFeedbackService.remove(req.userFeedback);
    responseSuccess(res);
}
