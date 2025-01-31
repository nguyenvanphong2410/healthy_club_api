import calculateRevenueStatistics from "@/app/commands/statistics/calculate-revenue-statistics";
import {Order, Statistic} from "@/app/models";
import {STATUS_ORDER_TYPE, db} from "@/configs";

const refreshStatistics = async () => {
    try {
        await db.connect();
        console.log("Drop Statistic collection...");
        await Statistic.collection.drop();
        console.log("Statistic collection dropped successfully.");

        console.log("Update Order collection...");
        await Order.updateMany({deleted: false, status: STATUS_ORDER_TYPE.COMPLETE, calculated: true}, {$set: {calculated: false}});
        console.log("Order collection updated successfully.");

        console.log("Calculate revenue statistics...");
        await calculateRevenueStatistics();
        console.log("Calculate successful revenue statistics.");

        process.exit(0);
    } catch (error) {
        console.error("Error refresh statistics:", error);
        process.exit(1);
    }
};

refreshStatistics();
