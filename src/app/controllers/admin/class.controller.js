import {responseSuccess} from "@/utils/helpers";
import * as classService from "@/app/services/class.service";

export async function getListClass(req, res) {
    return responseSuccess(res, await classService.getListClass(req.query));
}

export async function getDetailClass(req, res) {
    await responseSuccess(res, await classService.getDetailClass(req.params.id));
}

export async function getStudentOfClass(req, res) {
    await responseSuccess(res, await classService.getStudentOfClass(req.params.id));
}

export async function createClass(req, res) {
    await classService.createClass(req.body, req.currentAccount);
    return responseSuccess(res, null, 201);
}

export async function updateClass(req, res) {
    await classService.updateClass(req.class, req.body, req.currentAccount);
    return responseSuccess(res, null, 201);
}

export async function deleteClass(req, res) {
    await classService.deleteClass(req.class);
    return responseSuccess(res);
}

export async function getAllClass(req, res) {
    return responseSuccess(res, await classService.getAllClass());
}
