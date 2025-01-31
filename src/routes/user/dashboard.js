import {Router} from "express";
import * as dashboardController from "@/app/controllers/user/dashboard.controller";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import * as dashboardRequest from "@/app/requests/user/dashboard.request";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.USER)));

router.get(
    "/order-histories",
    asyncHandler(validate(dashboardRequest.getOrderHistories)),
    asyncHandler(dashboardController.getOrderHistories)
);

export default router;
