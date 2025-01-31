import {Order} from "@/app/models";
import { STATUS_ORDER_TYPE, instantBankAccountManager } from "@/configs";
import {responseError} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";

export async function checkOrderIdStatusPending(req, res, next) {
    const {orderId} = req.params;
    if (isValidObjectId(orderId)) {
        const order = await Order.findOne({_id: orderId, deleted: false});
        if (order) {
            if(order.status !== STATUS_ORDER_TYPE.PENDING){
                return responseError(res, 404, "Giao dịch đã được xử lý.");
            }
            req.order = order;
            return next();
        }
    }
    return responseError(res, 404, "Giao dịch không tồn tại hoặc đã bị xoá.");
}

export async function checkGenerateQrCode(req, res, next) {
    const pkg = req?.course;
    const qr_url = await instantBankAccountManager.generateImageQrCode({
        amount: pkg?.current_price
    });
    if(qr_url){
        req.qr_url = qr_url;
        return next();
    }
    return responseError(res, 400, "Không thể tạo mã QR vui lòng thử lại sau.");
}
