import {getToken, responseError, responseSuccess} from "@/utils/helpers";
import * as authService from "@/app/services/auth.service";

export async function login(req, res) {
    const validLogin = await authService.checkValidUserLogin(req.body);
    if (validLogin) {
        return responseSuccess(res, authService.authToken(validLogin._id, validLogin.account_type));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không chính xác.");
    }
}

export async function logout(req, res) {
    const token = getToken(req.headers);
    await authService.blockToken(token);
    return responseSuccess(res);
}

export async function me(req, res) {
    return responseSuccess(res, await authService.profile(req.currentAccount));
}

export async function updateMe(req, res) {
    await authService.updateInfo(req.currentAccount, req.body);
    return responseSuccess(res, null, 201, "Cập nhật thông tin tài khoản thành công.");
}

export async function changePassword(req, res) {
    await authService.resetPassword(req.currentAccount, req.body.new_password);
    return responseSuccess(res, null, 201, "Đổi mật khẩu thành công.");
}

export async function register(req, res) {
    const newUser = await authService.register(req.body);
    return responseSuccess(res, newUser,201, "Đăng ký thành công");
}

export async function activate(req, res) {
    const result = await authService.activate(req.activateUser);
    return responseSuccess(res, result, 201, "Kích hoạt tài khoản thành công.");
}
