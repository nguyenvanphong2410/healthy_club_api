import {Config} from "@/app/models";
import {CONFIG_TYPE} from "@/configs";
import path from "path";
import fs from "fs";

async function copyImages() {
    const sampleDir = path.join("public", "samples", "images");
    const uploadDir = path.join("public", "uploads", "images");
    const images = fs.readdirSync(sampleDir);

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    images.forEach((image) => {
        const srcPath = path.join(sampleDir, image);
        const destPath = path.join(uploadDir, image);

        fs.copyFileSync(srcPath, destPath);
    });

    return images.map((image) => path.join("uploads", "images", image));
}

export default async function () {
    const imagePaths = await copyImages();

    const contact = {
        type: CONFIG_TYPE.CONTACT,
        config: {
            phone: "0362800999",
            email: "duccanh@gmail.com",
            socials: [
                {
                    icon: imagePaths[0] || "",
                    link: "#",
                },
                {
                    icon: imagePaths[1] || "",
                    link: "#",
                },
                {
                    icon: imagePaths[2] || "",
                    link: "#",
                },
            ],
        },
    };

    await Config.findOneAndUpdate({type: contact.type}, {$set: contact}, {upsert: true});
}
