import {Router} from "express";

import * as userMiddleware from "@/app/middleware/admin/user.middleware";
import * as userRequest from "@/app/requests/user/dashboard.request";
import * as adminUserRequest from "@/app/requests/admin/user.request";
import * as userController from "@/app/controllers/admin/user.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

//Lấy tất cả hội viên
router.get(
    "/all-customer",
    asyncHandler(userController.getAllCustomer)
);

router.get(
    "/:userId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("detail-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.getInfoUser),
);

router.get(
    "/:userId/order-histories",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("detail-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.getOrderHistories)),
    asyncHandler(userController.getUserOrderHistories),
);

router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-student")),
    asyncHandler(upload),
    asyncHandler(validate(adminUserRequest.create)),
    asyncHandler(userController.createUser)
);

router.put(
    "/:userId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(upload),
    asyncHandler(validate(adminUserRequest.update)),
    asyncHandler(userController.updateUser),
);

router.delete(
    "/:userId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.removeUser)
);

router.patch(
    "/:userId/change-status",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(adminUserRequest.changeStatus)),
    asyncHandler(userController.changeStatus),
);

router.patch(
    "/:userId/change-password",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-reset-password-student")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(adminUserRequest.changePassword)),
    asyncHandler(userController.changePassword),
);

router.get(
    "/list/:type(unconfirmed|confirmed)",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-student")),
    asyncHandler(userMiddleware.checkUserConfirmed),
    asyncHandler(userController.getList)
);

router.patch(
    "/:userId/approved",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-student")),
    asyncHandler(userMiddleware.checkUserIdUnconfirmed),
    asyncHandler(userController.approvedUser),
);


export default router;
