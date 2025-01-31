import {db} from "@/configs";

const resetData = async () => {
    try {
        await db.connect();
        process.exit(0);
    } catch (error) {
        console.error("Error refresh statistics:", error);
        process.exit(1);
    }
};

resetData();
