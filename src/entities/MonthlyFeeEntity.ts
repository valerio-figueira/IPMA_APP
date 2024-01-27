import IMonthlyFee from "../interfaces/IMonthlyFee";

export default class MonthlyFeeEntity {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    created_at?: Date;

    constructor(body: IMonthlyFee) {
        this.monthly_fee_id = body.monthly_fee_id;
        this.member_id = body.member_id;
        this.amount = body.amount;
        this.reference_month = body.reference_month;
        this.reference_year = body.reference_year || new Date().getFullYear();
        this.created_at = body.created_at;
    }
}