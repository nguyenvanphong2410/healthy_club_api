import {Router} from "express";

import * as orderMiddleware from "@/app/middleware/admin/order.middleware";
import * as orderRequest from "@/app/requests/admin/order.request";
import * as orderController from "@/app/controllers/admin/order.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-order")),
    asyncHandler(validate(orderRequest.readRoot)),
    asyncHandler(orderController.readRoot),
);

router.get(
    "/list-course",
    asyncHandler(orderController.readListCourse)
);

router.patch(
    "/:orderId/change-status",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-confirm")),
    asyncHandler(orderMiddleware.checkOrderId),
    asyncHandler(validate(orderRequest.changeStatus)),
    asyncHandler(orderController.changeStatus),
);

router.delete(
    "/:orderId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-delete")),
    asyncHandler(orderMiddleware.checkOrderId),
    asyncHandler(orderController.removeItem),
);

export default router;
