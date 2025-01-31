import {CONFIG_TYPE, LINK_STATIC_URL} from "@/configs";
import {Config} from "../models";
import _ from "lodash";
import {FileUpload} from "@/utils/types";

export async function details(type) {
    const data = await Config.findOne({type});
    const result = {...data?.config};
    switch (type) {
        case CONFIG_TYPE.CONTACT:
            if (result.socials && _.isArray(result.socials)) {
                result.socials = result.socials.map((social) => {
                    if (social.icon && _.isString(social.icon)) {
                        social.icon = LINK_STATIC_URL + social.icon;
                    }
                    return social;
                });
            }
            break;
    }
    return result;
}

export async function update(type, data) {
    const result = {...data};
    switch (type) {
        case CONFIG_TYPE.CONTACT:
            {
                const contact = await Config.findOne({type});

                if (data.socials && _.isArray(data.socials)) {
                    result.socials = data.socials.map((social, index) => {
                        if (contact?.config?.socials?.[index]?.icon && social.icon instanceof FileUpload) {
                            FileUpload.remove(contact.config.socials[index].icon);
                        }
                        if (social.icon instanceof FileUpload) {
                            social.icon = social.icon.save("images");
                        }else {
                            social.icon = social.icon.replace(LINK_STATIC_URL, "");
                        }
                        return social;
                    });
                }
            }

            break;
    }

    return await Config.updateOne({type}, {config: result}, {upsert: true});
}
