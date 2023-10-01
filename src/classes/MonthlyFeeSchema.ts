import IMonthlyFee from "../interfaces/IMonthlyFee";

export default class MonthlyFeeSchema {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    status: 'Pending' | 'Paid' | 'Cancelled';
    reference_date: Date;
    payment_date: Date | null;
    registration_date?: Date;

    constructor(body: IMonthlyFee) {
        this.monthly_fee_id = body.monthly_fee_id;
        this.member_id = body.member_id;
        this.amount = body.amount;
        this.reference_month = body.reference_month;
        this.reference_year = body.reference_year;
        this.status = body.status;
        this.reference_date = body.reference_date;
        this.payment_date = body.payment_date;
        this.registration_date = body.registration_date;
    }
}