import {responseError} from "@/utils/helpers";
import { Admin } from "@/app/models";
import { isValidObjectId } from "mongoose";
import { PROTECTED } from "@/configs";

export const checkAdminId = async function (req, res, next) {
    const _id = req.params.adminId ;

    if (isValidObjectId(_id)) {
        const admin = await Admin.findOne({_id, deleted: false});
        if (admin) {
            if(admin.protected === PROTECTED.PROTECTED){
                return responseError(res, 400, "Quản trị viên được bảo vệ không thể xóa.");
            }
            req.admin = admin;
            return next();
        }
    }

    return responseError(res, 404, "Quản trị viên không tồn tại hoặc đã bị xóa.");
};
