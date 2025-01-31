import {Router} from "express";
import authRouter from "./auth";
import orderRouter from "./order";
import configRouter from "./config";
import userRouter from "./user";
import courseRouter from "./course";
import dashboardRouter from "./dashboard";
import bankRouter from "./bank";
import roleRouter from "./role";
import permissionRouter from "./permission";
import configServiceRouter from "./config-service";
import configContactRouter from "./config-contacts";
import userFeedbackRouter from "./user-feedback";
import classRouter from "./class";
import teacherRouter from "./teacher";
import scoreRouter from "./score";
import myCalendarRouter from "./my-calendar";

const router = Router();

router.use("/auth", authRouter);
router.use("/orders", orderRouter);
router.use("/config", configRouter);
router.use("/customer", userRouter);
router.use("/courses", courseRouter);
router.use("/dashboard", dashboardRouter);
router.use("/banks", bankRouter);
router.use("/roles", roleRouter);
router.use("/permissions", permissionRouter);
router.use("/config-services", configServiceRouter);
router.use("/config-contacts", configContactRouter);
router.use("/user-feedback", userFeedbackRouter);
router.use("/class", classRouter);
router.use("/teacher", teacherRouter);
router.use("/score", scoreRouter);
router.use("/my-calendar", myCalendarRouter);


export default router;
