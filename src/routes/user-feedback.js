import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import * as userFeedbackController from "@/app/controllers/user-feedback.controller";

const router = Router();

router.get(
    "/",
    asyncHandler(userFeedbackController.readRoot),
);

export default router;
