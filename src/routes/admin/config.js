import {Router} from "express";

import * as configRequest from "@/app/requests/admin/config.request";
import * as configController from "@/app/controllers/admin/config.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/bank",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-config-bank")),
    asyncHandler(configController.getConfigBank)
);

router.put(
    "/bank",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-config-bank")),
    asyncHandler(validate(configRequest.updateBank)),
    asyncHandler(configController.updateConfigBank),
);

export default router;
