import IPayment from "../interfaces/IPayments";

export class PaymentEntity {
    payment_id?: number;
    installment_id: number;
    paid_amount: number;
    status: 'PENDENTE' | 'PAGO' | 'CANCELADO'
    transaction_date: Date;
    created_at?: Date;

    constructor(installment: IPayment) {
        this.payment_id = installment.payment_id;
        this.installment_id = installment.installment_id;
        this.paid_amount = installment.paid_amount;
        this.status = installment.status;
        this.transaction_date = installment.transaction_date;
        this.created_at = installment.created_at;
    }
}

export default PaymentEntity