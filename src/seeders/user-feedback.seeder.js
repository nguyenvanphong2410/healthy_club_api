import {UserFeedback} from "@/app/models";

export default async function userFeedbackSeeder() {
    const LIST_FEEDBACK = [
        {
            avatar: "avatar-0.png",
            cover: "cover-0.jpeg",
            name: "Nguyễn Văn Phong",
            content: "<p>Tôi rất hài lòng với khóa tập của trung tâm, hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng  </p>",
        },
        {
            avatar: "avatar-1.jpeg",
            cover: "cover-1.jpeg",
            name: "Đặng Văn Hoàng",
            content: "<p>Tôi rất hài lòng với khóa tập của trung tâm, hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng  </p>",
        },
        {
            avatar: "avatar-2.png",
            cover: "cover-2.jpeg",
            name: "Nguyễn Phúc Đức",
            content: "<p>Tôi rất hài lòng với khóa tập của trung tâm, hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng hài lòng  </p>",
        },
    ];

    const promises = LIST_FEEDBACK.map((item) =>
        UserFeedback.findOneAndUpdate({name: item.name}, {$set: item}, {upsert: true}),
    );

    await Promise.all(promises);
}
