import {responseSuccess} from "@/utils/helpers";
import * as scoreService from "@/app/services/score.service";

export async function getScoreOfStudent(req, res) {
    const result = await scoreService.getScoreOfStudent(req.scoreOfStudent);
    return responseSuccess(res, result);
}

export async function getListStudentOfClass(req, res) {
    const result = await scoreService.getListStudentOfClass(req.classOf);
    return responseSuccess(res, result);
}

export async function createScoreOfStudent(req, res) {
    await scoreService.createScoreOfStudent(req.currentAccount, req.body);
    return responseSuccess(res, null, 201);
}

export async function updateScoreOfStudent(req, res) {
    await scoreService.updateScoreOfStudent(req.currentAccount, req.scoreOfStudent, req.body);
    return responseSuccess(res, null, 201);
}
