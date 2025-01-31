import {LINK_STATIC_URL} from "@/configs";
import {UserFeedback} from "../models";
import { FileUpload } from "@/utils/types";

export async function all() {
    const result = await UserFeedback.find({deleted: false}).lean();
    result.forEach(function (item) {
        item.cover = LINK_STATIC_URL + item.cover;
        item.avatar = LINK_STATIC_URL + item.avatar;
    });
    return result;
}

export async function filter() {
    const result = await UserFeedback.find({deleted: false}).lean();
    result.forEach(function (item) {
        item.cover = LINK_STATIC_URL + item.cover;
        item.avatar = LINK_STATIC_URL + item.avatar;
    });
    return result;
}

export async function create({cover, avatar, name, content}) {
    cover = cover.save();
    avatar = avatar.save();
    await UserFeedback.create({cover, avatar, name, content});
}

export async function update(userFeedback, {cover, avatar, name, content}) {
    if (cover) {
        if (userFeedback.cover && userFeedback.cover.startsWith("uploads")) {
            FileUpload.remove(userFeedback.cover);
        }
        userFeedback.cover = cover.save();
    }
    if (avatar) {
        if (userFeedback.avatar && userFeedback.avatar.startsWith("uploads")) {
            FileUpload.remove(userFeedback.avatar);
        }
        userFeedback.avatar = avatar.save();
    }
    userFeedback.name = name;
    userFeedback.content = content;
    await userFeedback.save();
}

export async function remove(userFeedback) {
    userFeedback.deleted = true;
    await userFeedback.save();
}
