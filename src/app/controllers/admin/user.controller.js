import { getOrderHistories} from "@/app/services/dashboard.service";
import {responseSuccess} from "@/utils/helpers";
import * as userService from "@/app/services/user.service";
import * as authService from "@/app/services/auth.service";

export async function getInfoUser(req, res) {
    const {_id, name, phone} = req.user.toObject();
    return responseSuccess(res, {_id, name, phone});
}

export async function getUserOrderHistories(req, res) {
    const result = await getOrderHistories(req.user, req.query);

    return responseSuccess(res, result);
}

export async function createUser(req, res) {
    await userService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateUser(req, res) {
    await userService.update(req.user, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeUser(req, res) {
    await userService.remove(req.user);
    return responseSuccess(res);
}

export async function changeStatus(req, res) {
    return responseSuccess(res, await userService.changeStatus(req.user, req.body.status));
}

export async function getList(req, res) {
    return responseSuccess(res, await userService.getList(req.query, req.userConfirmed));
}

export async function getAllCustomer(req, res) {
    return responseSuccess(res, await userService.getAllCustomer());
}

export async function changePassword(req, res) {
    return responseSuccess(res, await userService.changePassword(req.user, req.body.password));
}

export async function approvedUser(req, res) {
    await authService.activate(req.user);
    return responseSuccess(res);
}
