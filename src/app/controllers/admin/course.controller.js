import * as courseService from "@/app/services/course.service";
import {responseSuccess} from "@/utils/helpers";

export async function createItem(req, res) {
    await courseService.create(req.body, req.currentAccount);
    return responseSuccess(res, null, 201, "Tạo mới gói nạp thành công.");
}

export async function updateItem(req, res) {
    await courseService.update(req.course, req.body, req.currentAccount);
    return responseSuccess(res, null, 201, "Cập nhật gói nạp thành công.");
}

export async function deleteItem(req, res) {
    await courseService.remove(req.course);
    return responseSuccess(res, null, 200, "Xoá gói nạp thành công");
}

export async function highlightedItem(req, res) {
    await courseService.highlightedItem(req.course);
    return responseSuccess(res);
}

export async function readRoot(req, res) {
    const result = await courseService.getListCourse(req.query);
    return responseSuccess(res, result);
}

export async function getAllCourse(req, res) {
    return responseSuccess(res, await courseService.getAllCourse(req.query));
}

export async function getViewClassOf(req, res) {
    await responseSuccess(res, await courseService.getViewClassOf(req.params.courseId));
}
