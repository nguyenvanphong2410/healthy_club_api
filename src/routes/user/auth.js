import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import * as authController from "@/app/controllers/user/auth.controller";
import * as authRequest from "@/app/requests/user/auth.request";
import * as sharedAuthRequest from "@/app/requests/auth.request";
import * as authMiddleware from "@/app/middleware/user/auth.middleware";

const router = Router();

router.post(
    "/login",
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authMiddleware.checkUserActivated),
    asyncHandler(authController.login),
);

router.post(
    "/register",
    asyncHandler(validate(authRequest.register)),
    asyncHandler(authController.register)
);

router.post("/activate", asyncHandler(validate(authRequest.activate)), asyncHandler(authController.activate));

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.USER)),
    asyncHandler(authController.logout),
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.USER)),
    asyncHandler(authController.me),
);

router.put(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.USER)),
    asyncHandler(upload),
    asyncHandler(validate(authRequest.updateMe)),
    asyncHandler(authController.updateMe),
);

router.patch(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(ensureRole(ACCOUNT_TYPE.USER)),
    asyncHandler(validate(sharedAuthRequest.changePassword)),
    asyncHandler(authController.changePassword),
);

export default router;
