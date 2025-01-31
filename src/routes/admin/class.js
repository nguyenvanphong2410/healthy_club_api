import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {verifyToken, validate, upload, ensureRole} from "@/app/middleware/common";

import * as classRequest from "@/app/requests/admin/class.request";
import * as classController from "@/app/controllers/admin/class.controller";
import * as classMiddleware from "@/app/middleware/admin/class.middleware";

import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));

router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-class")),
    asyncHandler(validate(classRequest.getListClassRequest)),
    asyncHandler(classController.getListClass),
);

router.get(
    "/all",
    asyncHandler(classController.getAllClass),
);

router.get(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("detail-class")),
    asyncHandler(classMiddleware.checkClass),
    asyncHandler(classController.getDetailClass),
);

router.get(
    "/get-student-of-class/:id",
    asyncHandler(classMiddleware.checkClass),
    asyncHandler(classController.getStudentOfClass),
);

router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-class")),
    asyncHandler(upload),
    asyncHandler(validate(classRequest.createClassRequest)),
    asyncHandler(classController.createClass),
);

router.put(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-class")),
    asyncHandler(classMiddleware.checkClass),
    asyncHandler(upload),
    asyncHandler(validate(classRequest.updateClassRequest)),
    asyncHandler(classController.updateClass),
);

router.delete(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-class")),
    asyncHandler(classMiddleware.checkClass),
    asyncHandler(classController.deleteClass),
);

export default router;
