import {Router} from "express";

import * as bankController from "@/app/controllers/admin/bank.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole,verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-config-bank")),
    asyncHandler(bankController.getAllBank)
);

export default router;
