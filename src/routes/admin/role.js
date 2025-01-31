import {Router} from "express";

import * as roleRequest from "@/app/requests/admin/role.request";
import * as roleController from "@/app/controllers/admin/role.controller";
import * as roleMiddleware from "@/app/middleware/admin/role.middleware";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-role")),
    asyncHandler(validate(roleRequest.createRole)),
    asyncHandler(roleController.createRole)
);

router.put(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(validate(roleRequest.updateRole)),
    asyncHandler(roleController.updateRole),
);

router.delete(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleController.removeRole)
);

router.put(
    "/:id/update-permission-for-role/:permissionId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-permission")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleMiddleware.checkPermissionId),
    asyncHandler(roleController.updatePermissionForRole)
);

router.get(
    "/:id/employees",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleController.getAllAdminHasRole)
);

router.get(
    "/:id/employees-without-role",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleController.getAllAdminWithoutRole)
);

router.put(
    "/:id/update-role-admin",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-employee-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(validate(roleRequest.updateRoleAdmin)),
    asyncHandler(roleController.updateRoleForAdmin)
);

router.delete(
    "/:id/remove-role-admin/:adminId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-employee-role")),
    asyncHandler(roleMiddleware.checkRoleId),
    asyncHandler(roleMiddleware.checkAdminId),
    asyncHandler(roleController.removeRoleFromAdmin)
);

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-role")),
    asyncHandler(roleController.getListRole)
);

export default router;
