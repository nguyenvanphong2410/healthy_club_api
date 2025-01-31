import {STATUS_ORDER_TYPE} from "@/configs";
import {Order, Course, User, Score} from "../models";
import _ from "lodash";
import {decodeNum, generateCodeOrder} from "@/utils/helpers";
import {instantBankAccountManager} from "@/configs/bank-account";
import {Bank} from "../models/bank";
import {Class} from "../models/class";

export async function filter({q, status, page, per_page, field, sort_order, course_name}) {
    q = !_.isNil(q) ? {$regex: q, $options: "i"} : q;
    const query = Order.aggregate();
    const filter = {
        deleted: false,
        ...(_.isNumber(status) && {status}),
        ...(course_name.length > 0 && {course_name: {$in: course_name}}),
    };
    query
        .match(filter)
        .lookup({
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
        })
        .unwind("$user")
        .lookup({
            from: "admins",
            localField: "censor_id",
            foreignField: "_id",
            as: "censor",
        })
        .unwind({
            path: "$censor",
            preserveNullAndEmptyArrays: true,
        });
    if (q) {
        query.match({$or: [{code: q}, {"user.name": q}, {"user.phone": q}]});
    }
    const sortExpression =
        field === "user"
            ? {
                "user.name": sort_order,
                "user.phone": sort_order,
                _id: -1,
            }
            : {[field]: sort_order, _id: -1};
    query
        .sort(sortExpression)
        .project({"user.password": 0, "censor.password": 0})
        .facet({
            metadata: [{$count: "total"}],
            data: [{$skip: (page - 1) * per_page}, {$limit: per_page}],
        });

    const [result] = await query.exec();
    const total = _.isEmpty(result.metadata) ? 0 : result.metadata[0].total;
    const orders = result.data;

    return {total, page, per_page, orders};
}

export async function changeOrderStatus(order, newStatus, censor) {
    if (newStatus === STATUS_ORDER_TYPE.COMPLETE) {
        const user = await User.findById(order.user_id);
        const current_point = decodeNum(user.point) + order.course_point;
        user.point = current_point;
        await user.save();

        const currentPoint = decodeNum(user.point) + order.course_point;
        order.current_point = currentPoint;

        // Thêm logic tìm kiếm và cập nhật Class
        const classRecord = await Class.findById(order.class_id);
        if (classRecord) {
            if (!classRecord.student_ids.includes(order.user_id)) {
                classRecord.student_ids.push(order.user_id);
                await classRecord.save();
            }
        }

        // Thêm logic tìm kiếm và cập nhật Course
        const courseRecord = await Course.findById(order.course_id);
        if (courseRecord) {
            if (!courseRecord.student_of_course.includes(order.user_id)) {
                courseRecord.student_of_course.push(order.user_id);
                await courseRecord.save();
            }
        }

        // Tạo bản ghi mới trong bảng Score
        const newScore = new Score({
            student_id: order.user_id,
            class_id: order.class_id,
            attendance_score: 0,
            plus_score: 0,
            midterm_score: 0,
            final_score: 0,
        });
        await newScore.save();
    }

    order.censor_id = censor._id;
    order.status = newStatus;
    order.time = new Date();
    await order.save();
}


export async function remove(order) {
    order.deleted = true;
    await order.save();
}

export async function listOrderCourseName() {
    const result = await Order.distinct("course_name");
    return result;
}

export async function create(user, pkg, classOfCourse) {

    const checkCodeOrder = async (code) => {
        const result = await Order.findOne({code, deleted: false});
        if (result) {
            return await checkCodeOrder(generateCodeOrder(10));
        }
        return code;
    };

    const code = await checkCodeOrder(generateCodeOrder(10));

    const order = new Order({
        code: code,
        course_id: pkg._id,
        course_type: pkg.type,
        course_name: pkg.name,
        course_description: pkg.description,
        course_point: 50,
        course_original_price: pkg.original_price,
        course_current_price: pkg.current_price,
        current_point: decodeNum(user.point),
        user_id: user._id,
        class_id: classOfCourse,

        status: STATUS_ORDER_TYPE.PENDING,
    });

    await order.save();
    return order;
}

export async function getQrCode(order) {
    const qr_url = await instantBankAccountManager.generateImageQrCode({
        amount: order.course_current_price,
        addInfo: order.code,
    });

    if (qr_url) {
        return {qr_url};
    } else {
        const bank = await Bank.findOne({
            code: instantBankAccountManager.config.bank_id,
        });
        return {
            name_bank: bank.name,
            name: instantBankAccountManager.config.account_name,
            number_bank: instantBankAccountManager.config.account_no,
            content: order.code,
            amount: order.course_current_price,
        };
    }
}
