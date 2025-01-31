import {STATUS_ACTIVE} from "@/configs";
import {createModel} from "./base";
import { encodeNum } from "@/utils/helpers";
import { Schema } from "mongoose";
import { GENDER } from "@/utils/helpers/constants";

export const User = createModel(
    "User",
    "users",
    {
        code: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
            default: null,
        },
        email: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
            enum: [...Object.values(GENDER)],
            default: GENDER.OTHER,
        },
        phone: {
            type: String,
            default: null,
        },
        address: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            default: null,
        },
        point: {
            type: Schema.Types.Mixed,
            // required: true,
            default: null,
            set: encodeNum
        },
        status: {
            type: Number,
            required: true,
            enum: Object.values(STATUS_ACTIVE),
            default: STATUS_ACTIVE.ACTIVE
        },
        confirmed: {
            type: Boolean,
            default: false,
        },
        deleted: {type: Boolean, default: false},
    },
    {
        toJSON: {
            virtuals: false,
            transform: (doc, ret) => {
                // eslint-disable-next-line no-unused-vars
                const {password, ...result} = ret;
                return result;
            },
        }
    },
);
