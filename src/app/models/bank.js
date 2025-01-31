import {createModel} from "./base";

export const Bank = createModel("Bank", "banks", {
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
});
