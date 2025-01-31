import {LINK_STATIC_URL} from "@/configs";
import {Score, User} from "../models";
import {Class} from "../models/class";

export async function getScoreOfStudent(scoreOfStudent) {
    // Lấy danh sách hội viên từ mảng student_ids
    const student = await User.findOne({_id: scoreOfStudent.student_id}).lean();

    // Nối LINK_STATIC_URL vào avatar của mỗi hội viên

    student.avatar = student.avatar ? LINK_STATIC_URL + student.avatar : null;

    return {
        scoreOfStudent,
        student,
    };
}

export async function getListStudentOfClass(idClass) {
    const classFound = await Class.findOne({
        _id: idClass,
        deleted: false,
    }).lean();

    // Nối LINK_STATIC_URL vào mỗi ảnh trong mảng images
    if (classFound.images && classFound.images.length > 0) {
        classFound.images = classFound.images.map((image) => LINK_STATIC_URL + image);
    }

    // Lấy danh sách hội viên từ mảng student_ids
    const students = await User.find({
        _id: {$in: classFound.student_ids},
    }).lean();

    // Nối LINK_STATIC_URL vào avatar của mỗi hội viên
    students.forEach((student) => {
        if (student.avatar) {
            student.avatar = student.avatar ? LINK_STATIC_URL + student.avatar : null;
        }
    });

    // Định dạng kết quả trả về
    return {
        ...classFound,
        students, // Thêm danh sách hội viên vào object lớp thể thao
    };
}

export async function createScoreOfStudent(
    currentAccount,
    {student_id, class_id, attendance_score, midterm_score, final_score, plus_score, updater_id, creator_id},
) {
    console.log("🌈 ~ creator_id:", creator_id);
    console.log("🌈 ~ updater_id:", updater_id);
    const score = new Score({
        student_id,
        class_id,
        attendance_score,
        midterm_score,
        final_score,
        plus_score,
        updater_id: currentAccount._id,
        creator_id: currentAccount._id,
    });

    await score.save();

    return score;
}

export async function updateScoreOfStudent(
    currentAccount,
    scoreOfStudent,
    {attendance_score, plus_score, midterm_score, final_score},
) {

    scoreOfStudent.attendance_score = attendance_score;
    scoreOfStudent.plus_score = plus_score;
    scoreOfStudent.midterm_score = midterm_score;
    scoreOfStudent.final_score = final_score;
    scoreOfStudent.updater_id = currentAccount._id;
    await scoreOfStudent.save();

    return scoreOfStudent;
}
