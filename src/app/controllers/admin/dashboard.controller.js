import * as statisticService from "@/app/services/statistic.service";
import {responseSuccess} from "@/utils/helpers";
import _ from "lodash";

export async function overview(_req, res) {
    const result = await statisticService.sumUpAll();
    return responseSuccess(res, result);
}

export async function revenueStatistics(req, res) {
    const type = _.upperCase(req.params.type);
    const result = await statisticService.integratedStatistics(type, req.query);
    return responseSuccess(res, result);
}
