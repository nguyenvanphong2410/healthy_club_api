import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import * as courseController from "@/app/controllers/course.controller";
import * as courseRequest from "@/app/requests/admin/course.request";
import * as courseMiddleware from "@/app/middleware/admin/course.middleware";
import {validate} from "@/app/middleware/common";

const router = Router();

router.get(
    "/",
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(courseController.listCourse),
);

//Chi tiết
router.get(
    "/:courseId",
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(courseController.getDetailsCourse),
);

export default router;
