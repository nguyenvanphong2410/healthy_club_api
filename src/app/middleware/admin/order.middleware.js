import {Order} from "@/app/models";
import {responseError} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";

export async function checkOrderId(req, res, next) {
    const {orderId} = req.params;
    if (isValidObjectId(orderId)) {
        const order = await Order.findOne({_id: orderId, deleted: false});
        if (order) {
            req.order = order;
            return next();
        }
    }
    return responseError(res, 404, "Yêu cầu không tồn tại hoặc đã bị xoá.");
}
