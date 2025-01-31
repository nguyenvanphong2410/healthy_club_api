import {Admin, Order, Course, User} from "../models";
import moment from "moment";
import _ from "lodash";
import {STATUS_ORDER_TYPE} from "@/configs";
import { USER_TYPE } from "@/utils/helpers/constants";
import { Class } from "../models/class";

export async function sumUpAll() {
    // Tính tổng course_current_price của tất cả các đơn hàng hoàn thành (status = STATUS_ORDER_TYPE.COMPLETE)
    const aggregate = Order.aggregate()
        .match({
            status: STATUS_ORDER_TYPE.COMPLETE, // Chỉ lấy các đơn hàng hoàn thành
            deleted: false, // Bỏ qua các đơn hàng đã bị xóa
        })
        .group({
            _id: null,
            total_revenue: { $sum: "$course_current_price" }, // Tổng course_current_price
        })
        .project({ _id: 0 });

    const revenue = await aggregate.exec();

    const total_teacher = await Admin.countDocuments({ deleted: false, user_type: USER_TYPE.TEACHER });
    const total_customer = await User.countDocuments({ deleted: false, confirmed: true });
    const total_order = await Order.countDocuments({ deleted: false, status: STATUS_ORDER_TYPE.COMPLETE });
    const total_admin = await Admin.countDocuments({ deleted: false, is_admin: true, protected: 0 });
    const total_course = await Course.countDocuments({ deleted: false });
    const total_class= await Class.countDocuments({ deleted: false });

    return {
        total_revenue: revenue?.[0]?.total_revenue || 0, // Gán tổng doanh thu vào total_revenue
        total_teacher: total_teacher || 0,
        total_customer: total_customer || 0,
        total_order: total_order || 0,
        total_admin: total_admin || 0,
        total_course: total_course || 0,
        total_class: total_class || 0,
    };
}


function convertToDate(type, start_time, end_time) {
    const FORMAT = {
        DAILY: "DD-MM-YYYY",
        MONTHLY: "MM-YYYY",
        YEARLY: "YYYY",
    };
    const UNIT_OF_TIME = {
        DAILY: "day",
        MONTHLY: "month",
        YEARLY: "year",
    };
    const format = FORMAT[type];
    let time = moment(start_time, format);
    const unit = UNIT_OF_TIME[type];
    start_time = start_time && time.isValid() ? time.startOf(unit) : null;

    time = moment(end_time, format);
    end_time = end_time && time.isValid() ? time.startOf(unit) : null;
    const result = [];
    if (start_time && end_time) {
        if (start_time.isAfter(end_time, unit)) {
            [start_time, end_time] = [end_time, start_time];
        }
    } else if (!start_time && !end_time) {
        end_time = moment().startOf(unit);
        start_time = end_time.clone().subtract(7, unit);
    } else if (start_time) {
        end_time = start_time.clone().add(7, unit);
    } else {
        start_time = end_time.clone().subtract(7, unit);
    }
    for (let time = start_time.clone(); end_time.isSameOrAfter(time); time = time.clone().add(1, unit)) {
        result.push(time);
    }
    return [result, format, unit];
}

export async function integratedStatistics(type, {start_time, end_time}) {
    const [times, format, unit] = convertToDate(type, start_time, end_time);

    const startDates = moment(times[0]).startOf(unit).toDate();
    const endDates = moment(times[times.length - 1]).endOf(unit).toDate();

    const stats = await Order.aggregate()
        .match({
            time: { $gte: startDates, $lte: endDates },
            status: STATUS_ORDER_TYPE.COMPLETE, // Lọc theo status COMPLETE
        })
        .project({
            period: {
                $dateToString: {
                    format: unit === "day" ? "%Y-%m-%d" : unit === "month" ? "%Y-%m" : "%Y",
                    date: "$time",
                },
            },
            course_current_price: 1, // Chỉ cần trường course_current_price
            time: 1,
        })
        .group({
            _id: "$period",
            time: { $first: "$time" },
            total_revenue: { $sum: "$course_current_price" }, // Cộng tổng course_current_price
        })
        .sort({ _id: 1 })
        .project({
            _id: 0,
            time: 1,
            value: "$total_revenue",
        });

    for (const time of times) {
        if (!stats.some((stat) => time.isSame(stat.time, unit))) {
            stats.push({
                time: time.toDate(),
                value: 0,
            });
        }
    }

    const result = _.sortBy(stats, "time");
    result.forEach((item) => {
        item.time = moment(item.time).format(format);
    });
    return result;
}


export const UPDATE_STATISTIC_TYPE = {
    ORDER: 0,
    TRANSACTION: 1,
    USER: 2,
};
