import {ObjectId, createModel} from "./base";
import {PACKAGE_TYPE, STATUS_ORDER_TYPE} from "@/configs";

export const Order = createModel("Order", "orders", {
    code: {
        type: String,
        required: true,
    },
    course_id: {
        type: ObjectId,
        ref: "Course",
        required: true,
    },
    course_type: {
        type: Number,
        enum: Object.values(PACKAGE_TYPE),
        required: true
    },
    course_name: {
        type: String,
        required: true,
    },
    course_description: {
        type: String,
        default: null,
    },
    course_point: {
        type: Number,
        required: true,
    },
    course_original_price: {
        type: Number,
        required: true,
    },
    course_current_price: {
        type: Number,
        required: true,
    },
    current_point: {
        type: Number,
        required: true,
    },
    user_id: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    class_id: {
        type: ObjectId,
        ref: "Class",
        required: true,
    },
    time: {
        type: Date,
        default: null,
    },
    status: {
        type: Number,
        required: true,
        enum: Object.values(STATUS_ORDER_TYPE),
    },
    censor_id: {
        type: ObjectId,
        ref: "Admin",
        default: null,
    },
    calculated: {
        type: Boolean,
        default: false,
    },
    deleted: {type: Boolean, default: false},
});
