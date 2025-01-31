import {Router} from "express";

import * as courseMiddleware from "@/app/middleware/user/course.middleware";
import * as orderMiddleware from "@/app/middleware/user/order.middleware";
import * as orderController from "@/app/controllers/user/order.controller";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.USER)));

router.post(
    "/course/:courseId/:classOfCourseId",
    asyncHandler(courseMiddleware.checkCourseId),
    asyncHandler(courseMiddleware.checkClassOfCourseId),
    asyncHandler(orderMiddleware.checkGenerateQrCode),
    asyncHandler(orderController.createOrder),
);

router.get(
    "/:orderId/qr-code",
    asyncHandler(orderMiddleware.checkOrderIdStatusPending),
    asyncHandler(orderController.getQrCode),
);

export default router;
