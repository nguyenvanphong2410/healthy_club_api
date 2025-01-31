import {Bank} from "@/app/models/bank";

export default async function () {
    const originBanks = [
        { code: "ICB", name: "VietinBank" },
        { code: "VCB", name: "Vietcombank" },
        { code: "BIDV", name: "BIDV" },
        { code: "VBA", name: "Agribank" },
        { code: "OCB", name: "OCB" },
        { code: "MB", name: "MBBank" },
        { code: "TCB", name: "Techcombank" },
        { code: "ACB", name: "ACB" },
        { code: "VPB", name: "VPBank" },
        { code: "TPB", name: "TPBank" },
        { code: "STB", name: "Sacombank" },
        { code: "HDB", name: "HDBank" },
        { code: "VCCB", name: "VietCapitalBank" },
        { code: "SCB", name: "SCB" },
        { code: "VIB", name: "VIB" },
        { code: "SHB", name: "SHB" },
        { code: "EIB", name: "Eximbank" },
        { code: "MSB", name: "MSB" },
        { code: "CAKE", name: "CAKE" },
        { code: "Ubank", name: "Ubank" },
        { code: "TIMO", name: "Timo" },
        { code: "VTLMONEY", name: "ViettelMoney" },
        { code: "VNPTMONEY", name: "VNPTMoney" },
        { code: "SGICB", name: "SaigonBank" },
        { code: "BAB", name: "BacABank" },
        { code: "PVCB", name: "PVcomBank" },
        { code: "Oceanbank", name: "Oceanbank" },
        { code: "NCB", name: "NCB" },
        { code: "SHBVN", name: "ShinhanBank" },
        { code: "ABB", name: "ABBANK" },
        { code: "VAB", name: "VietABank" },
        { code: "NAB", name: "NamABank" },
        { code: "PGB", name: "PGBank" },
        { code: "VIETBANK", name: "VietBank" },
        { code: "BVB", name: "BaoVietBank" },
        { code: "SEAB", name: "SeABank" },
        { code: "COOPBANK", name: "COOPBANK" },
        { code: "LPB", name: "LienVietPostBank" },
        { code: "KLB", name: "KienLongBank" },
        { code: "KBank", name: "KBank" },
        { code: "KBHN", name: "KookminHN" },
        { code: "KEBHANAHCM", name: "KEBHanaHCM" },
        { code: "KEBHANAHN", name: "KEBHANAHN" },
        { code: "MAFC", name: "MAFC" },
        { code: "CITIBANK", name: "Citibank" },
        { code: "KBHCM", name: "KookminHCM" },
        { code: "VBSP", name: "VBSP" },
        { code: "WVN", name: "Woori" },
        { code: "VRB", name: "VRB" },
        { code: "UOB", name: "UnitedOverseas" },
        { code: "SCVN", name: "StandardChartered" },
        { code: "PBVN", name: "PublicBank" },
        { code: "NHB HN", name: "Nonghyup" },
        { code: "IVB", name: "IndovinaBank" },
        { code: "IBK - HCM", name: "IBKHCM" },
        { code: "IBK - HN", name: "IBKHN" },
        { code: "HSBC", name: "HSBC" },
        { code: "HLBVN", name: "HongLeong" },
        { code: "GPB", name: "GPBank" },
        { code: "DOB", name: "DongABank" },
        { code: "DBS", name: "DBSBank" },
        { code: "CIMB", name: "CIMB" },
        { code: "CBB", name: "CBBank" }
    ];

    const banksData = originBanks.map((item) => ({
        code: item.code,
        name: item.name,
    }));

    for (const bankData of banksData) {
        const existingBank = await Bank.findOne({
            $or: [{name: bankData.name}, {code: bankData.code}],
        });

        if (!existingBank) {
            const bank = new Bank(bankData);
            await bank.save();
        }
    }
}
