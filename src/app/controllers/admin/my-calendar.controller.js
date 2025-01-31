import {responseSuccess} from "@/utils/helpers";
import * as myCalendarService from "@/app/services/my-calendar.service";

export async function getListMyCalendarTeacher(req, res) {
    return responseSuccess(res, await myCalendarService.getListMyCalendarTeacher(req.query, req.currentAccount));
}
