import {Router} from "express";
import * as myCoursesController from "@/app/controllers/user/my-course.controller";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, verifyToken, validate} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import * as courseRequest from "@/app/requests/admin/course.request";
import * as courseMiddleware from "@/app/middleware/admin/course.middleware";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.USER)));

router.get(
    "/done",
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(myCoursesController.getListMyCoursesDone)
);

router.get(
    "/in-progress",
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(myCoursesController.getListMyCoursesInProgress)
);

router.get(
    "/pending",
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(myCoursesController.getListMyCoursesPending)
);

router.get(
    "/:courseId",
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(myCoursesController.getClassOfCourse),
);

export default router;
