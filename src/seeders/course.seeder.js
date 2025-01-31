import {Course} from "@/app/models";

export default async function () {
    const LIST_PACKAGE = [

    ];
    const promises = LIST_PACKAGE.map((item) => {
        return Course.findOneAndUpdate({name: item.name}, {$set: item}, {upsert: true});
    });

    await Promise.all(promises);
}
