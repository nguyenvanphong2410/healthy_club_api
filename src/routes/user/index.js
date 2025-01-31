import {Router} from "express";
import authRouter from "./auth";
import orderRouter from "./order";
import dashboardRouter from "./dashboard";
import myCourseRouter from "./my-course";
import myCalendarRouter from "./my-calendar";
import teacherRouter from "./teacher";
import commentRouter from "./comment";

const router = Router();

router.use("/dashboard", dashboardRouter);
router.use("/auth", authRouter);
router.use("/orders", orderRouter);
router.use("/my-course", myCourseRouter);
router.use("/my-calendar", myCalendarRouter);
router.use("/teacher", teacherRouter);
router.use("/comment", commentRouter);

export default router;
