import {responseSuccess} from "@/utils/helpers";
import * as bankService from "@/app/services/bank.service";

export async function getAllBank(req, res) {
    return responseSuccess(res, await bankService.getAllBank());
}
