import jwt, {JsonWebTokenError, NotBeforeError, TokenExpiredError} from "jsonwebtoken";
import {isUndefined} from "lodash";
import {Admin, Role, User} from "@/app/models";
import {tokenBlocklist} from "@/app/services/auth.service";
import {ACCOUNT_TYPE, SECRET_KEY, STATUS_ACTIVE, TOKEN_TYPE} from "@/configs";
import {responseError, getToken} from "@/utils/helpers";
import { Permission } from "@/app/models/permission";

export async function verifyToken(req, res, next) {
    try {
        const token = getToken(req.headers);

        if (token) {
            const allowedToken = isUndefined(await tokenBlocklist.get(token));
            if (allowedToken) {
                const {type, data} = jwt.verify(token, SECRET_KEY);

                if (type === TOKEN_TYPE.AUTHORIZATION) {
                    let account;
                    let permissions;
                    switch(data.account_type){
                        case ACCOUNT_TYPE.USER:
                            account = await User.findOne({_id: data.account_id, deleted: false, status: STATUS_ACTIVE.ACTIVE});
                            break;
                        case ACCOUNT_TYPE.ADMIN:
                            account = await Admin.findOne({_id: data.account_id, deleted: false, status: STATUS_ACTIVE.ACTIVE});
                            if (account) {
                                const roles = await Role.find({ _id: { $in: account.role_ids }, deleted: false });
                                permissions = await Permission.find({ _id: { $in: roles.map(role => role.permission_ids).flat() } });
                                req.permissions =  permissions.map(item => item.code);
                            }
                            break;
                    }
                    if (account) {
                        account.account_type = data.account_type;
                        req.currentAccount = account;
                        return next();
                    }
                }

                if (type === TOKEN_TYPE.FORGOT_PASSWORD) {
                    const account = await Admin.findOne({_id: data.account_id, deleted: false, status: STATUS_ACTIVE.ACTIVE});

                    if (account) {
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
