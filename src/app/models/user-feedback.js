import {createModel} from "./base";

export const UserFeedback = createModel("UserFeedback", "user_feedbacks", {
    avatar: {
        type: String,
        required: true,
    },
    cover: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
});
