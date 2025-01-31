import {google} from "googleapis";
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN} from "./constants";
import fs from "fs";
import _ from "lodash";

const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
oauth2Client.setCredentials({refresh_token: GOOGLE_REFRESH_TOKEN});

const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});

const googleDrive = {
    getFolderId: async (folderName, parentFolderId = null) => {
        let query = `mimeType='application/vnd.google-apps.folder' and name='${folderName}' and trashed=false`;
        if (parentFolderId) {
            query += ` and '${parentFolderId}' in parents`;
        }

        const response = await drive.files.list({
            q: query,
            fields: "files(id)",
        });

        return response?.data?.files?.[0]?.id || null;
    },

    createFolder: async (folderName, parentFolderId = null) => {
        const fileMetadata = {
            name: folderName,
            mimeType: "application/vnd.google-apps.folder",
            parents: parentFolderId ? [parentFolderId] : null,
        };

        const response = await drive.files.create({
            requestBody: fileMetadata,
            fields: "id",
        });

        const createdFolderId = response.data.id;

        return createdFolderId;
    },

    uploadFile: async ({name, mineType, sourcePath, folderNames}) => {
        let folderId = null;
        if (folderNames && _.isArray(folderNames)) {
            let parentFolderId = null;
            for (let i = 0; i < folderNames.length; i++) {
                let id = await googleDrive.getFolderId(folderNames[i], parentFolderId);
                if (!id) {
                    id = await googleDrive.createFolder(folderNames[i], parentFolderId);
                }
                if (id) {
                    parentFolderId = id;
                }
            }
            if (parentFolderId) {
                folderId = parentFolderId;
            }
        }
        const requestBody = {
            name,
            mineType,
        };
        if (folderId) {
            requestBody.parents = [folderId];
        }
        await drive.files.create({
            requestBody,
            media: {
                mineType,
                body: fs.createReadStream(sourcePath),
            },
        });
    },
};

export default googleDrive;
