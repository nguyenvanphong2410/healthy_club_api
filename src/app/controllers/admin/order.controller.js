import * as orderService from "@/app/services/order.service";
import {STATUS_ORDER_TYPE} from "@/configs";
import {responseError, responseSuccess} from "@/utils/helpers";

export async function readRoot(req, res) {
    const result = await orderService.filter(req.query);
    return responseSuccess(res, result);
}

export async function changeStatus(req, res) {
    if (req.order.status !== STATUS_ORDER_TYPE.PENDING) {
        return responseError(res, 403, "Yêu cầu đã được xử lý.");
    }
    await orderService.changeOrderStatus(req.order, req.body.status, req.currentAccount);
    return responseSuccess(res, null, 201);
}

export async function removeItem(req, res) {
    if (req.order.status !== STATUS_ORDER_TYPE.PENDING) {
        return responseError(res, 403, "Không thể xoá yêu cầu đã được xử lý.");
    }
    await orderService.remove(req.order);
    return responseSuccess(res);
}

export async function readListCourse(req, res){
    const result = await orderService.listOrderCourseName();
    return responseSuccess(res, result);
}
