import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import { ObjectId, Score } from "@/app/models";
import { Class } from "@/app/models/class";


//Kiểm tra sự tồn tại của bản ghi điểm
export const checkScore = async function (req, res, next) {
    const _idStudent = req.params.idStudent;
    const _idClass = req.params.idClass;

    if (isValidObjectId(_idStudent) && isValidObjectId(_idClass)) {
        const scoreOfStudent = await Score.findOne({
            student_id: new ObjectId(_idStudent),
            class_id: new ObjectId(_idClass),
        });
        if (scoreOfStudent) {
            req.scoreOfStudent = scoreOfStudent;
            return next();
        }
    }

    return responseError(res, 404, "Dữ liệu điểm số không tồn tại hoặc đã bị xóa");
};

export const checkClass = async function (req, res, next) {

    const _idClass = req.params.idClass;

    if (isValidObjectId(_idClass)) {
        const classOf = await Class.findOne({
            _id: new ObjectId(_idClass),
            deleted: false,
        });
        if (classOf) {
            req.classOf = classOf;
            return next();
        }
    }

    return responseError(res, 404, "Lớp không tồn tại hoặc đã bị xóa");
};
