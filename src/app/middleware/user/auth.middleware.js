import { User } from "@/app/models";
import { STATUS_ACTIVE } from "@/configs";
import {responseError} from "@/utils/helpers";

export async function checkUserActivated(req, res, next) {

    const userLogin = await User.findOne({
        email: req.body.email,
        deleted: false,
        status: STATUS_ACTIVE.ACTIVE
    });

    if (userLogin) {
        return next();
    }
    return responseError(res, 403, "Tài khoản của bạn đã bị khóa.", null, "ACCOUNT_LOCKED");
}
