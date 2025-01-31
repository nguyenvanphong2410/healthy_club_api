import {LINK_STATIC_URL} from "@/configs";
import {Admin, Comment, Course, User} from "../models";

export async function getAllCommentByIdDoc(documentId) {
    const document = await Course.findOne({_id: documentId, deleted: false});

    const comments = await Comment.find({course_id: documentId, deleted: false}).sort({created_at: -1});

    // Map bình luận với thông tin người tạo bình luận từ User và Admin
    const commentsWithCreatorInfo = await Promise.all(
        comments.map(async (comment) => {
            let creator = await User.findOne({_id: comment.creator_id, deleted: false});

            if (!creator) {
                // Nếu không tìm thấy trong User, tìm trong Admin
                creator = await Admin.findOne({_id: comment.creator_id, deleted: false});
            }

            return {
                _id: comment._id,
                creator_id: creator ? creator._id : null,
                name: creator ? creator.name : null,
                avatar: creator && creator.avatar ? LINK_STATIC_URL + creator.avatar : null,
                content: comment.content,
                created_at: comment.created_at,
                updated_at: comment.updated_at,
                user_type: (creator && creator.user_type) ? creator.user_type : null,
                protected: (creator && creator.protected) ? creator.protected : null,
                is_admin: (creator && creator.is_admin) ? creator.is_admin : null,

            };
        }),
    );

    return {
        _id: document._id,
        name_doc: document.name,
        comment: commentsWithCreatorInfo,
    };
}


export async function createComment(idDoc, {content}, creator) {
    const comment = new Comment({
        course_id: idDoc,
        creator_id: creator._id,
        content: content,
    });

    await comment.save();

    return comment;
}

export async function updateComment(idDoc, {content}) {
    await Comment.findByIdAndUpdate(idDoc, {content: content}, {new: true});
}

export async function deleteComment(idDoc) {
    await Comment.findByIdAndUpdate(idDoc, {deleted: true}, {new: true});
}
