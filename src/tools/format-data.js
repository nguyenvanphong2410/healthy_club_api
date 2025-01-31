import {DB_AUTH_SOURCE, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME} from "@/configs";
import {generateMongoURI} from "@/utils/helpers";
import {MongoClient} from "mongodb";

const uri = generateMongoURI({
    host: DB_HOST,
    port: DB_PORT,
    dbName: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    authSource: DB_AUTH_SOURCE,
});

const client = new MongoClient(uri);

const formatData = async () => {
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        console.log("🌈 ~ formatData ~ db:", db);
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

formatData();
