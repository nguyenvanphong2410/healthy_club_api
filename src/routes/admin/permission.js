import {Router} from "express";

import * as permissionTypeController from "@/app/controllers/admin/permission.controller";
import * as permissionMiddleware from "@/app/middleware/admin/permission.middleware";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/types",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-role")),
    asyncHandler(permissionTypeController.getListPermissionType)
);

router.get(
    "/:id",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-role")),
    asyncHandler(permissionMiddleware.checkRoleId),
    asyncHandler(permissionTypeController.getPermission)
);

export default router;
