import {responseSuccess} from "@/utils/helpers";
import * as myCoursesService from "@/app/services/my-course.service";

export async function getListMyCoursesDone(req, res) {
    return responseSuccess(res, await myCoursesService.getListMyCoursesDone(req.query, req.currentAccount));
}

export async function getListMyCoursesInProgress(req, res) {
    return responseSuccess(res, await myCoursesService.getListMyCoursesInProgress(req.query, req.currentAccount));
}

export async function getListMyCoursesPending(req, res) {
    return responseSuccess(res, await myCoursesService.getListMyCoursesPending(req.query, req.currentAccount));
}


export async function getClassOfCourse(req, res) {
    return responseSuccess(res, await myCoursesService.getClassOfCourses(req.currentAccount, req.params.courseId));
}
