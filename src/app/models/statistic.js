import {createModel} from "./base";

export const Statistic = createModel("Statistic", "statistics", {
    time: {
        type: Date,
        required: true,
    },
    total_revenue: {
        type: Number,
        required: true,
        default: 0,
    },
});
