import {ensureRole, verifyToken} from "@/app/middleware/common";
import {ACCOUNT_TYPE} from "@/configs";
import {asyncHandler} from "@/utils/handlers";
import {Router} from "express";

const router = Router();
router.use(asyncHandler(verifyToken));
router.use(asyncHandler(ensureRole(ACCOUNT_TYPE.ADMIN)));

export default router;
