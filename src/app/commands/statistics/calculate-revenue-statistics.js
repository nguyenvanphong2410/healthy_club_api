import {PACKAGE_TYPE, STATUS_ORDER_TYPE} from "@/configs";
import {Order, Course, Statistic} from "../../models";
import moment from "moment";

const calculateRevenueStatistics = async () => {
    const orders = await Order.find({
        deleted: false,
        status: STATUS_ORDER_TYPE.COMPLETE,
        calculated: {$ne: true},
    });

    for (const order of orders) {
        if (!Object.values(PACKAGE_TYPE).includes(order.course_type)) {
            const pkg = await Course.findOne({deleted: false, _id: order.course_id});
            order.course_type = pkg?.type || PACKAGE_TYPE.NORMALLY;
        }

        const startTime = moment(order.time || order.created_at).startOf("day");

        const filter = {time: startTime.toDate()};

        const update = {$inc: {total_revenue: order.course_current_price}};

        await Statistic.findOneAndUpdate(filter, update, {upsert: true});

        order.calculated = true;
        await order.save();
    }
};

export default calculateRevenueStatistics;
