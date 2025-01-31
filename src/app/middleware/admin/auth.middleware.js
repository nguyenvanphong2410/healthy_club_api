import {getToken, responseError} from "@/utils/helpers";
import {emailForgotPasswordList} from "@/app/services/auth.service";
import jwt, {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import {Admin} from "@/app/models";
import {SECRET_KEY, STATUS_ACTIVE, TOKEN_TYPE} from "@/configs";

export const checkCountDownForgotPassword = async function (req, res, next) {
    const email = req.body.email;

    const isExists = await emailForgotPasswordList.get(email);
    if (!isExists) {
        return next();
    }

    return responseError(res, 429, "Yêu cầu xử lý bị từ chối. Vui lòng đợi một thời gian trước khi thử lại.");
};

export async function verifyTokenForgotPassword(req, res, next) {
    try {
        const token = getToken(req.headers);

        if (token) {
            const {type, data} = jwt.verify(token, SECRET_KEY);

            if (type === TOKEN_TYPE.FORGOT_PASSWORD) {
                const account = await Admin.findOne({
                    _id: data.account_id,
                    deleted: false,
                    status: STATUS_ACTIVE.ACTIVE,
                });

                if (account) {
                    const isExists = await emailForgotPasswordList.get(account.email);
                    if (isExists) {
                        account.account_type = data.account_type;
                        req.currentAccount = account;
                        return next();
                    }
                }
            }
        }

        return responseError(res, 401, "Từ chối truy cập");
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            if (error instanceof TokenExpiredError) {
                return responseError(res, 401, "Mã xác thực đã hết hạn");
            } else if (error instanceof NotBeforeError) {
                return responseError(res, 401, "Mã xác thực không hoạt động");
            } else {
                return responseError(res, 401, "Mã xác thực không hợp lệ");
            }
        }

        return next(error);
    }
}
