import {Router} from "express";
import {asyncHandler} from "@/utils/handlers/async.handler";
import {verifyToken, ensureRole} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs/enum";

import * as dashboardController from "@/app/controllers/admin/dashboard.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/overview",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-admin")),
    asyncHandler(dashboardController.overview),
);

//Doanh thu
router.get(
    "/revenue/:type(daily|monthly|yearly)",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-admin")),
    asyncHandler(dashboardController.revenueStatistics),
);

export default router;
