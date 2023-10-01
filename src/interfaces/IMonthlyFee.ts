export default interface IMonthlyFee {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    status: 'Pending' | 'Paid' | 'Cancelled';
    reference_date: Date;
    payment_date: Date | null;
    registration_date?: Date;
}