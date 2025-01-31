import {Config} from "@/app/models";
import {CONFIG_TYPE} from "@/configs";

export default async function () {
    const LIST_CONFIG = [
        {
            type: CONFIG_TYPE.BANK,
            config: {
                bank_id: "",
                account_no: "",
                template: "compact2",
                account_name: "",
            },
        },
        {
            type: CONFIG_TYPE.CONTACT,
            config: {
                phone: null,
                email: null,
                socials: [
                    {
                        icon: "",
                        link: "",
                    },
                ],
            },
        },
    ];
    const promises = LIST_CONFIG.map((item) => {
        return Config.findOneAndUpdate({type: item.type}, {$set: item}, {upsert: true});
    });

    await Promise.all(promises);
}
