import userRouter from "./user";
import adminRouter from "./admin";
import adminManagementRouter from "./admin-management";
import courseRouter from "./course";
import contactRouter from "./contact";
import userFeedbackRouter from "./user-feedback";

export default function route(app) {
    app.use("/user", userRouter);
    app.use("/admin", adminRouter);
    app.use("/admin-management", adminManagementRouter);
    app.use("/courses", courseRouter);
    app.use("/contact-information", contactRouter);
    app.use("/user-feedback", userFeedbackRouter);
}
