import {createModel} from "./base";

export const Score = createModel("Score", "scores", {
    student_id: {
        type: String,
        required: true,
    },
    class_id: {
        type: String,
        required: true,
    },
    updater_id: {
        type: String,
        default: null,
    },
    creator_id: {
        type: String,
        default: null,
    },
    attendance_score: {
        //Điểm chuyên cần
        type: Number,
        default: 0,
    },
    plus_score: {
        //Điểm cộng
        type: Number,
        default: 0,
    },
    midterm_score: {
        //Điểm giữa kì
        type: Number,
        default: 0,
    },
    final_score: {
        //Điểm cuối kì
        type: Number,
        default: 0,
    },
});
