export default interface IMonthlyFee {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    created_at?: Date;
}