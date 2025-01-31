import {responseSuccess} from "@/utils/helpers";
import * as configService from "@/app/services/config.service";
import {CONFIG_TYPE} from "@/configs";

export async function getContactInformation(req, res) {
    return responseSuccess(res, await configService.details(CONFIG_TYPE.CONTACT));
}
