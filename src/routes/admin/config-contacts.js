import {ensureRole, upload, validate, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import {asyncHandler} from "@/utils/handlers";
import {Router} from "express";
import * as configContactController from "@/app/controllers/admin/config-contact.controller";
import * as configRequest from "@/app/requests/admin/config.request";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

const router = Router();
router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-config-contact")),
    asyncHandler(configContactController.getConfigContact)
);

router.put(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-config-contact")),
    asyncHandler(upload),
    asyncHandler(configRequest.checkConfigContact),
    asyncHandler(validate(configRequest.updateContact)),
    asyncHandler(configContactController.updateConfigContact),
);

export default router;
