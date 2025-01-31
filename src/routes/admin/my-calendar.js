import {Router} from "express";
import * as myCalendarController from "@/app/controllers/admin/my-calendar.controller";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, verifyToken, validate} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import * as courseRequest from "@/app/requests/admin/course.request";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(myCalendarController.getListMyCalendarTeacher)
);

export default router;
