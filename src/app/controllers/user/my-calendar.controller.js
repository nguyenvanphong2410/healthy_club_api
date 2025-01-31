import {responseSuccess} from "@/utils/helpers";
import * as myCalendarService from "@/app/services/my-calendar.service";

export async function getListMyCalendar(req, res) {
    return responseSuccess(res, await myCalendarService.getListMyCalendar(req.query, req.currentAccount));
}
