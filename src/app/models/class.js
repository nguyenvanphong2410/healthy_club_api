import {createModel, ObjectId} from "./base";

export const Class = createModel("Class", "classes", {
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
    course_id: {
        type: ObjectId,
        ref: "Course",
        default: null,
    },
    student_ids: {
        type: [ObjectId],
        ref: "User",
        default: [],
    },
    teacher_id: {
        type: ObjectId,
        ref: "Admin",
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
    name_file: {
        type: String,
        required: true,
    },
    file_record: {
        type: String,
        default: null
    },
    max_number_student: {
        type: Number,
        default: 0
    },
    notes: {
        type: String,
        default: null,
    },
    deleted: {
        type: Boolean,
        default: false
    },
});
