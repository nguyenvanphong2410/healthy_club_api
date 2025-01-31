import {PROTECTED, STATUS_ACTIVE} from "@/configs";
import {ObjectId, createModel} from "./base";
import { GENDER, USER_TYPE } from "@/utils/helpers/constants";

export const Admin = createModel(
    "Admin",
    "admins",
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
            trim: true,
            lowercase: true,
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
            required: true,
        },
        role_ids: {
            type: [{type: ObjectId, ref: "Role"}],
            default: [],
        },
        status: {
            type: Number,
            required: true,
            enum: Object.values(STATUS_ACTIVE),
        },
        is_admin: {
            type: Boolean,
            required: true,
            default: false,
        },
        user_type: {
            type: String,
            // required: true,
            enum: [...Object.values(USER_TYPE)],
            default: null,
        },
        protected: {
            type: Number,
            required: true,
            enum: [...Object.values(PROTECTED)],
            default: PROTECTED.UNPROTECTED,
        },
        deleted: {type: Boolean, default: false},
    },
    {
        toJSON: {
            virtuals: true,
            transform: (doc, ret) => {
                // eslint-disable-next-line no-unused-vars
                const {password, ...result} = ret;
                return result;
            },
        },
        virtuals: {
            roles: {
                options: {
                    ref: "Role",
                    localField: "role_ids",
                    foreignField: "_id",
                },
            },
        },
    },
);
