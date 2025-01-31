import {responseSuccess} from "@/utils/helpers";
import * as courseService from "@/app/services/course.service";

export async function listCourse(req, res) {
    const result = await courseService.getListCourseForUser(req.query);
    return responseSuccess(res, result);
}

export async function getDetailsCourse(req, res) {
    await responseSuccess(res, await courseService.getDetailsCourse(req.params.courseId));
}
