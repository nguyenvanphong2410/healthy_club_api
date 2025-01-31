import {Course} from "@/app/models";
import {responseError, validateAsync} from "@/utils/helpers";
import {isValidObjectId} from "mongoose";
import {updateItem, updateGiftItem} from "@/app/requests/admin/course.request";
import {PACKAGE_TYPE} from "@/configs";

export async function checkCourseId(req, res, next) {
    if (isValidObjectId(req.params.courseId)) {
        const pkg = await Course.findOne({_id: req.params.courseId, deleted: false});
        if (pkg) {
            req.course = pkg;
            return next();
        }
    }
    return responseError(res, 404, "Khóa tập không tồn tại hoặc đã bị xoá");
}

export async function validateUpdateItem(req, res, next) {
    const schema = req.course.type === PACKAGE_TYPE.NEW_ACCOUNT_GIFT ? updateGiftItem : updateItem;
    const [value, error] = await validateAsync(schema, req.body);

    if (Object.keys(error).length > 0) {
        return responseError(res, 400, "Validation Error", error);
    }

    req.body = value;
    return next();
}

export async function canHighlightItem(req, res, next) {
    if (req.course.type === PACKAGE_TYPE.NEW_ACCOUNT_GIFT) {
        return responseError(res, 403, 'Không thể đánh dấu "Phổ biến" cho gói quà tặng.');
    }
    return next();
}
