import {ObjectId, Order} from "@/app/models";
import _ from "lodash";

export async function getOrderHistories(userId, {q, page, per_page, field, sort_order, course_id, status}) {
    q = !_.isNil(q) ? {$regex: q, $options: "i"} : q;

    const filter = {
        deleted: false,
        user_id: new ObjectId(userId),
        ...(q && {code: q}),
        ...(course_id && {course_id: new ObjectId(course_id)}),
        ...(_.isNumber(status) && {status}),
    };

    const result = await Order.aggregate([
        {
            $match: {...filter},
        },
        {
            $sort: {[field]: sort_order === "desc" ? -1 : 1},
        },
        {
            $facet: {
                data: [
                    {$skip: (page - 1) * per_page},
                    {$limit: per_page},
                    {
                        $project: {
                            deleted: 0,
                            user_id: 0,
                            censor_id: 0,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                data: 1,
            },
        },
    ]);

    const total = await Order.countDocuments(filter);
    const histories = result[0].data;

    return {total, page, per_page, histories};
}
