import {PACKAGE_TYPE} from "@/configs";
import {createModel, ObjectId} from "./base";
import {STATUS_ACTIVE} from "@/utils/helpers/constants";

export const Course = createModel("Course", "courses", {
    code: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    creator_id: {
        type: Object,
        ref: "Admin",
    },
    updater_id: {
        type: Object,
        ref: "Admin",
        default: null,
    },
    student_of_course: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    description: {
        type: String,
        default: null,
    },
    images: {
        type: [String],
        required: true,
        default: [],
    },
    image_featured: {
        type: Number,
        default: null,
    },
    start_time: {
        type: Date,
        required: true,
        default: null,
    },
    end_time: {
        type: Date,
        required: true,
        default: null,
    },
    status: {
        type: String,
        enum: [...Object.values(STATUS_ACTIVE)],
        default: STATUS_ACTIVE.UNLOCK,
    },
    original_price: {
        type: Number,
        required: true,
    },
    current_price: {
        type: Number,
        required: true,
    },
    is_highlight: {
        type: Boolean,
        default: false,
    },
    type: {
        type: Number,
        enum: Object.values(PACKAGE_TYPE),
        default: PACKAGE_TYPE.NORMALLY,
    },
    deleted: {type: Boolean, default: false},
});
