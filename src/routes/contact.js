import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import * as contactController from "@/app/controllers/contact-information";

const router = Router();

router.get(
    "/",
    asyncHandler(contactController.getContactInformation),
);

export default router;