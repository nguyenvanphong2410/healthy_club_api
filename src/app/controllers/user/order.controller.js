import * as orderService from "@/app/services/order.service";
import {responseSuccess} from "@/utils/helpers";

export async function createOrder(req, res) {
    const result = await orderService.create(req.currentAccount, req.course, req.classOfCourse);
    return responseSuccess(res, result);
}

export async function getQrCode(req, res) {
    const result = await orderService.getQrCode(req.order);
    return responseSuccess(res, result);
}
