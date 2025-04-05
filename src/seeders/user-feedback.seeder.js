import {UserFeedback} from "@/app/models";

export default async function userFeedbackSeeder() {
    const LIST_FEEDBACK = [
        {
            avatar: "avatar-0.png",
            cover: "cover-0.jpeg",
            name: "Nguyễn Đức Cảnh",
            content:
                "<p>Phòng tập rất sạch sẽ và đầy đủ thiết bị. Huấn luyện viên ở đây cực kỳ nhiệt tình và chuyên nghiệp. Mình cảm thấy rất có động lực mỗi khi đến đây tập luyện!</p>",
        },
        {
            avatar: "avatar-1.jpeg",
            cover: "cover-1.jpeg",
            name: "Nguyễn Văn Chiến",
            content:
                "<p>Không gian tập rộng rãi, thoáng mát. Mình đặc biệt thích lớp yoga buổi sáng – vừa thư giãn, vừa giúp cải thiện sức khỏe rõ rệt sau vài tuần tập</p>",
        },
        {
            avatar: "avatar-2.png",
            cover: "cover-2.jpeg",
            name: "Nguyễn Văn Phong",
            content:
                "<p>Dịch vụ khách hàng ở đây rất tốt. Mỗi khi có thắc mắc hoặc cần hỗ trợ, nhân viên luôn sẵn sàng giúp đỡ. Rất hài lòng và sẽ tiếp tục gắn bó lâu dài.</p>",
        },
    ];

    const promises = LIST_FEEDBACK.map((item) =>
        UserFeedback.findOneAndUpdate({name: item.name}, {$set: item}, {upsert: true}),
    );

    await Promise.all(promises);
}
