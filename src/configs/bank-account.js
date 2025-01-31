import {Config} from "@/app/models";
import {VIETQR_IMAGE_API} from "./constants";
import {CONFIG_TYPE} from "./enum";

class BankAccountManager {
    constructor() {
        this.vietqrApi = VIETQR_IMAGE_API;
        this.config = null;
    }

    async init() {
        this.config = await this.loadConfigFromDB();
    }

    async loadConfigFromDB() {
        const result = await Config.findOne({type: CONFIG_TYPE.BANK});
        return result.config;
    }

    async updateConfig() {
        this.config = await this.loadConfigFromDB();
    }

    async generateImageQrCode({amount, addInfo}) {
        try {
            if (!this.config) {
                await this.init();
            }
            if (!this.config.bank_id || !this.config.account_no) {
                throw new Error("No bank_id or account_no");
            }
            let url = `${this.vietqrApi}/${this.config.bank_id}-${this.config.account_no}-${this.config.template}.jpg`;
            let queryString = "";

            if (amount) {
                queryString += `&amount=${amount}`;
            }

            if (addInfo) {
                queryString += `&addInfo=${addInfo.replace(/ /g, "%20")}`;
            }

            if (this?.config?.account_name) {
                queryString += `&accountName=${this.config.account_name.replace(/ /g, "%20")}`;
            }

            if (queryString) {
                url = url + "?" + queryString.slice(1);
            }

            return url;
        } catch (error) {
            console.error("Error generate qr: ", error.message);
            throw error;
        }
    }
}

export const instantBankAccountManager = new BankAccountManager();
