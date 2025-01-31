import {responseSuccess} from "@/utils/helpers";
import * as configService from "@/app/services/config.service";
import {CONFIG_TYPE} from "@/configs";

export async function getConfigContact(req, res) {
    return responseSuccess(res, await configService.details(CONFIG_TYPE.CONTACT));
}

export async function updateConfigContact(req, res) {
    await configService.update(CONFIG_TYPE.CONTACT, req.body);
    return responseSuccess(res, null, 201);
}