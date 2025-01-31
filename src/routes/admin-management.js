import {Router} from "express";

import * as adminMiddleware from "@/app/middleware/admin/admin.middleware";
import * as adminRequest from "@/app/requests/admin/admin.request";
import * as adminController from "@/app/controllers/admin/admin.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-employee")),
    asyncHandler(upload),
    asyncHandler(validate(adminRequest.createAdmin)),
    asyncHandler(adminController.createAdmin)
);

router.put(
    "/:adminId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-employee")),
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(upload),
    asyncHandler(validate(adminRequest.updateAdmin)),
    asyncHandler(adminController.updateAdmin),
);

router.patch(
    "/:adminId/change-status",
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(validate(adminRequest.changeStatus)),
    asyncHandler(adminController.changeStatus),
);

router.patch(
    "/:adminId/change-password",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-reset-password-employee")),
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(validate(adminRequest.changePassword)),
    asyncHandler(adminController.changePassword),
);

router.delete(
    "/:adminId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-employee")),
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(adminController.removeAdmin)
);

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-employee")),
    asyncHandler(adminController.getListAdmin)
);

export default router;
