import * as searchRequest from "@/app/requests/search.request";
import {validate} from "./common";

export async function validateByServiceCode(req, res, next) {
    return validate(searchRequest.search[req.params.serviceCode])(req, res, next);
}
