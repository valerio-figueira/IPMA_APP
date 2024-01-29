interface IPayment {
    payment_id?: number;
    installment_id: number;
    payment_amount: number;
    status: 'PENDENTE' | 'PAGO' | 'CANCELADO';
    transaction_date: Date;
    created_at?: Date;
}

export default IPayment