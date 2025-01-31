import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, validate, verifyToken} from "@/app/middleware/common";

import {ACCOUNT_TYPE} from "@/configs";

import * as scoreRequest from "@/app/requests/admin/score.request";
import * as scoreController from "@/app/controllers/admin/score.controller";
import * as scoreMiddleware from "@/app/middleware/admin/score.middleware";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/score-of-student-of-class/:idStudent/:idClass",
    asyncHandler(scoreMiddleware.checkScore),
    asyncHandler(scoreController.getScoreOfStudent),
);

//Lấy tất cả sinh viên hợp lệ của lớp
router.get(
    "/:idClass",
    asyncHandler(scoreMiddleware.checkClass),
    asyncHandler(scoreController.getListStudentOfClass),
);

//Tạo mới điểm
router.post(
    "/",
    asyncHandler(validate(scoreRequest.createOrUpdateScoreOfStudentRequest)),
    asyncHandler(scoreController.createScoreOfStudent),
);

router.put(
    "/:idStudent/:idClass",
    asyncHandler(scoreMiddleware.checkScore),
    asyncHandler(validate(scoreRequest.updateScoreOfStudentRequest)),
    asyncHandler(scoreController.updateScoreOfStudent),
);

export default router;
