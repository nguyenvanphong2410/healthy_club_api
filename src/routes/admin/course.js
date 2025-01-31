const {Router} = require("express");

import * as courseMiddleware from "@/app/middleware/admin/course.middleware";
import * as courseRequest from "@/app/requests/admin/course.request";
import * as courseController from "@/app/controllers/admin/course.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-course")),
    asyncHandler(upload),
    asyncHandler(validate(courseRequest.createItem)),
    asyncHandler(courseController.createItem)
);
router.patch(
    "/:courseId/highlighted",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-popular-course")),
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(courseMiddleware.canHighlightItem),
    asyncHandler(courseController.highlightedItem)
);
router.put(
    "/:courseId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-course")),
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(upload),
    asyncHandler(validate(courseRequest.updateItem)),
    asyncHandler(courseController.updateItem)
);
router.delete(
    "/:courseId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-course")),
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(courseController.deleteItem)
);
router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-course")),
    asyncHandler(validate(courseRequest.getListCourseRequest)),
    asyncHandler(courseController.readRoot),
);

router.get(
    "/all",
    asyncHandler(courseController.getAllCourse),
);

//Lấy những lớp thể thao thuộc khóa
router.get(
    "/classOfCourse/:courseId",
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(courseController.getViewClassOf),
);

export default router;
