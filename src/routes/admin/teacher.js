import {Router} from "express";

import * as teacherMiddleware from "@/app/middleware/admin/teacher.middleware";
import * as teacherRequest from "@/app/requests/admin/teacher.request";
import * as teacherController from "@/app/controllers/admin/teacher.controller";
import * as ensurePermissionsMiddleware from "@/app/middleware/admin/ensure-permissions.middleware";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

//Huấn luyện viên Danh sách
router.get(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("list-teacher")),
    asyncHandler(teacherController.getListTeacher)
);

//Huấn luyện viên Tạo mới
router.post(
    "/",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("add-teacher")),
    asyncHandler(upload),
    asyncHandler(validate(teacherRequest.createTeacher)),
    asyncHandler(teacherController.createTeacher)
);

//Huấn luyện viên Cập nhật
router.put(
    "/:teacherId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-teacher")),
    asyncHandler(teacherMiddleware.checkTeacherId),
    asyncHandler(upload),
    asyncHandler(validate(teacherRequest.updateTeacher)),
    asyncHandler(teacherController.updateTeacher),
);

//Huấn luyện viên Thay đổi trạng thái
router.patch(
    "/:teacherId/change-status",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-teacher")),
    asyncHandler(teacherMiddleware.checkTeacherId),
    asyncHandler(validate(teacherRequest.changeStatus)),
    asyncHandler(teacherController.changeStatus),
);

//Huấn luyện viên Thay đổi mật khẩu
router.patch(
    "/:teacherId/change-password",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("edit-reset-password-teacher")),
    asyncHandler(teacherMiddleware.checkTeacherId),
    asyncHandler(validate(teacherRequest.changePassword)),
    asyncHandler(teacherController.changePassword),
);

//Huấn luyện viên Xóa
router.delete(
    "/:teacherId",
    asyncHandler(ensurePermissionsMiddleware.ensurePermissions("delete-teacher")),
    asyncHandler(teacherMiddleware.checkTeacherId),
    asyncHandler(teacherController.removeTeacher)
);



export default router;
