import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {User} from "@/app/models";

export const checkUserId = async function (req, res, next) {
    const _id = req.params.userId;

    if (isValidObjectId(_id)) {
        const user = await User.findOne({_id, deleted: false});
        if (user) {
            req.user = user;
            return next();
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};

export const checkUserConfirmed = async function (req, res, next) {
    const type = req.params.type;

    if (["unconfirmed", "confirmed"].includes(type)) {
        req.userConfirmed = type;
        return next();
    }

    return responseError(res, 404, "Đường dẫn không chính xác");
};

export const checkUserIdUnconfirmed = async function (req, res, next) {
    const _id = req.params.userId;

    if (isValidObjectId(_id)) {
        const user = await User.findOne({_id, deleted: false});
        if (user) {
            if(user.confirmed === false){
                req.user = user;
                return next();
            }
            return responseError(res, 404, "Người dùng đã xác thực");
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};
