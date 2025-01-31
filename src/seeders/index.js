import {db} from "../configs";
import roleSeeder from "./role.seeder";
import adminSeeder from "./admin.seeder";
import courseSeeder from "./course.seeder";
import configSeeder from "./config.seeder";
import bankSeeder from "./bank.seeder";
import permissionSeeder from "./permission.seeder";
import userFeedbackSeeder from "./user-feedback.seeder";
import contactSeeder from "./contact.seeder";

const allSeeds = {
    permission: permissionSeeder,
    role: roleSeeder,
    admin: adminSeeder,
    course: courseSeeder,
    config: configSeeder,
    bank: bankSeeder,
    userFeedback: userFeedbackSeeder,
    contact: contactSeeder,
};

const seeds = process.argv.slice(2);

async function seed() {
    try {
        await db.connect();
        console.log("Initializing data...");

        const runSeed = async (seedName) => {
            if (Object.hasOwnProperty.call(allSeeds, seedName)) {
                const seedFunction = allSeeds[seedName];
                await seedFunction();
                console.log(`Seed "${seedName}" completed.`);
            }
        };

        if (seeds.length === 0) {
            for (const seedName in allSeeds) {
                await runSeed(seedName);
            }
        } else {
            for (const seedName of seeds) {
                await runSeed(seedName);
            }
        }

        console.log("Data has been initialized!");
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

seed();
