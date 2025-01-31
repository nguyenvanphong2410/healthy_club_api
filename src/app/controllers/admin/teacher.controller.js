import {responseError, responseSuccess} from "@/utils/helpers";
import * as teacherService from "@/app/services/teacher.service";

//Huấn luyện viên
export async function createTeacher(req, res) {
    await teacherService.createTeacher(req);
    return responseSuccess(res, null, 201);
}

//Huấn luyện viên ALl
export async function getAllTeacher(req, res) {
    return responseSuccess(res, await teacherService.getAllTeacher(req.query));
}

export async function updateTeacher(req, res) {
    await teacherService.updateTeacher(req.teacher, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeTeacher(req, res) {
    if (req.currentAccount._id.equals(req.teacher._id)) {
        return responseError(res, 400, "Không thể xóa chính mình.");
    }

    await teacherService.remove(req.teacher);
    return responseSuccess(res);
}

export async function getListTeacher(req, res) {
    return responseSuccess(res, await teacherService.getList(req.query, req));
}

export async function changeStatus(req, res) {
    return responseSuccess(res, await teacherService.changeStatus(req.teacher, req.body.status));
}

export async function changePassword(req, res) {
    return responseSuccess(res, await teacherService.changePassword(req.teacher, req.body.password));
}
