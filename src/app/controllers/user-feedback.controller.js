import { responseSuccess } from "@/utils/helpers";
import * as userFeedbackService from "@/app/services/user-feedback.service";

export async function readRoot(req, res) {
    const result = await userFeedbackService.all();
    return responseSuccess(res, result);
}
