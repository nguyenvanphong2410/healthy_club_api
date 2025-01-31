import {CONFIG_TYPE} from "@/configs";
import {createModel} from "./base";

export const Config = createModel("Config", "configs", {
    config: {
        type: Object,
        required: true,
    },
    type: {
        type: Number,
        enum: Object.values(CONFIG_TYPE),
        required: true,
    },
    deleted: {type: Boolean, default: false},
});
