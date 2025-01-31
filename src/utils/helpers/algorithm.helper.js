import CryptoJS from "crypto-js";
import {CRYPTO_SECRET_KEY} from "@/configs";

export const generateRandomString = (length, characters) => {
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export const generateCodeOrder = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return generateRandomString(length, characters);
};

export const encodeNum = (num) => {
    const strNum = String(num);
    return CryptoJS.AES.encrypt(strNum, CRYPTO_SECRET_KEY).toString();
};

export const decodeNum = (encodedStr) => {
    const bytes = CryptoJS.AES.decrypt(encodedStr, CRYPTO_SECRET_KEY);
    const decryptedNum = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decryptedNum);
};

export function encode(data, secret_key) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secret_key).toString();
}

export const decode = function (dataEncrypt, secret_key) {
    const decrypt = CryptoJS.AES.decrypt(dataEncrypt, secret_key);
    return JSON.parse(decrypt.toString(CryptoJS.enc.Utf8));
};

export const formatVND = (amount) => {
    const amountStr = amount.toString();
    let formattedAmount = "";
    let count = 0;

    for (let i = amountStr.length - 1; i >= 0; i--) {
        formattedAmount = amountStr[i] + formattedAmount;
        count++;
        if (count % 3 === 0 && i !== 0) {
            formattedAmount = "." + formattedAmount;
        }
    }

    return formattedAmount + " VND";
};

export const generateMongoURI = ({host, port, dbName, username, password, authSource, replicaSet}) => {
    let uri = `${host}:${port}/${dbName}`;

    if (username && password) {
        uri = `${username}:${password}@${uri}`;
    }
    if (authSource) {
        uri = `${uri}?authSource=${authSource}`;
    }
    if (replicaSet) {
        uri = `${uri}?replicaSet=${replicaSet}`;
    }

    return "mongodb://" + uri;
};

export const capitalizeFirstLetter = (str) => {
    const trimmedStr = str.trim();
    const formattedStr = trimmedStr.replace(/\s+/g, " ");
    return formattedStr.charAt(0).toUpperCase() + formattedStr.slice(1);
};

export const handleName = (name) => {
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
        return words.slice(-2).join(" ");
    } else {
        return words[0];
    }
};
