import {responseSuccess} from "@/utils/helpers";
import * as dashboardService from "@/app/services/dashboard.service";

export async function getOrderHistories(req, res) {
    const result = await dashboardService.getOrderHistories(
        req.currentAccount,
        req.query
    );

    return responseSuccess(res, result);
}
