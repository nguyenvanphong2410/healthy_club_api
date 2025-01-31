import cron from "node-cron";
import {commandHandler} from "@/utils/handlers";
import calculateRevenueStatistics from "./statistics/calculate-revenue-statistics";

async function runEveryDay() {
    await calculateRevenueStatistics();
}
// run crone job every day 12 AM
const task = cron.schedule("0 0 0 * * *", commandHandler(runEveryDay));

export default task;
