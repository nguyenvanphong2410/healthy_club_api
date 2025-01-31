import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import * as teacherController from "@/app/controllers/admin/teacher.controller";

const router = Router();

//Huấn luyện viên
router.get(
    "/all",
    asyncHandler(teacherController.getAllTeacher)
);

export default router;
