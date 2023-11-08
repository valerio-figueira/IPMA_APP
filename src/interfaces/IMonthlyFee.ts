export default interface IMonthlyFee {
    monthly_fee_id?: number;
    member_id: number;
    amount: number;
    reference_month: number;
    reference_year: number;
    status: 'PENDENTE' | 'PAGO' | 'ANULADO';
    payment_date: Date | null;
    created_at?: Date;
}