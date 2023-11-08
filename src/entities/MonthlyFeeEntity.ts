import IMonthlyFee from "../interfaces/IMonthlyFee";

export default class MonthlyFeeEntity {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    status: 'PENDENTE' | 'PAGO' | 'ANULADO';
    payment_date: Date | null;
    created_at?: Date;

    constructor(body: IMonthlyFee) {
        this.monthly_fee_id = body.monthly_fee_id;
        this.member_id = body.member_id;
        this.amount = body.amount;
        this.reference_month = body.reference_month;
        this.reference_year = body.reference_year;
        this.status = body.status;
        this.payment_date = body.payment_date;
        this.created_at = body.created_at;
    }
}