import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import * as userFeedbackMiddleware from "@/app/middleware/admin/user-feedback.middleware";
import * as userFeedbackRequest from "@/app/requests/admin/user-feedback.request";
import * as userFeedbackController from "@/app/controllers/admin/user-feedback.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-config-feedback")),
    asyncHandler(userFeedbackController.readRoot),
);
router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-config-feedback")),
    asyncHandler(upload),
    asyncHandler(validate(userFeedbackRequest.createItem)),
    asyncHandler(userFeedbackController.createItem),
);
router.put(
    "/:userFeedbackId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-config-feedback")),
    asyncHandler(upload),
    asyncHandler(userFeedbackMiddleware.checkUserFeedbackId),
    asyncHandler(validate(userFeedbackRequest.updateItem)),
    asyncHandler(userFeedbackController.updateItem),
);
router.delete(
    "/:userFeedbackId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-config-feedback")),
    asyncHandler(userFeedbackMiddleware.checkUserFeedbackId),
    asyncHandler(userFeedbackController.deleteItem),
);

export default router;
