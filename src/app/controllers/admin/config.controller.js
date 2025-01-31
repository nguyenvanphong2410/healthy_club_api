import {responseSuccess} from "@/utils/helpers";
import * as configService from "@/app/services/config.service";
import {CONFIG_TYPE, instantBankAccountManager} from "@/configs";

export async function getConfigBank(req, res) {
    return responseSuccess(res, await configService.details(CONFIG_TYPE.BANK));
}

export async function updateConfigBank(req, res) {
    await configService.update(CONFIG_TYPE.BANK, req.body);
    await instantBankAccountManager.updateConfig();
    return responseSuccess(res, null, 201);
}

