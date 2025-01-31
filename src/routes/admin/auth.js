import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";

import * as authRequest from "@/app/requests/admin/auth.request";
import * as authController from "@/app/controllers/admin/auth.controller";
import * as authMiddleware from "@/app/middleware/admin/auth.middleware";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.post(
    "/login",
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authController.login)
);

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)),
    asyncHandler(authController.logout),
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)),
    asyncHandler(authController.me),
);

router.put(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)),
    asyncHandler(upload),
    asyncHandler(validate(authRequest.updateProfile)),
    asyncHandler(authController.updateProfile),
);

router.patch(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)),
    asyncHandler(validate(authRequest.changePassword)),
    asyncHandler(authController.changePassword),
);

router.patch(
    "/reset-password",
    asyncHandler(authMiddleware.verifyTokenForgotPassword),
    asyncHandler(validate(authRequest.resetPassword)),
    asyncHandler(authController.resetPassword),
);

export default router;
