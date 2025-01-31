import { Bank } from "../models/bank";

export async function getAllBank() {
    const banks = await Bank.find();
    return banks;
}
