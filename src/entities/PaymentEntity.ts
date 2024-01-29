import IPayment from "../interfaces/IPayments";
import CustomError from "../utils/CustomError";



export class PaymentEntity {
    payment_id?: number;
    installment_id: number;
    payment_amount: number;
    status: 'PENDENTE' | 'PAGO' | 'CANCELADO'
    transaction_date: Date;
    created_at?: Date;


    constructor(payment: IPayment) {
        this.validate(payment)

        this.payment_id = payment.payment_id;
        this.installment_id = payment.installment_id;
        this.payment_amount = payment.payment_amount;
        this.status = payment.status;
        this.transaction_date = payment.transaction_date;
        this.created_at = payment.created_at;
    }



    private validate(payment: IPayment) {
        this.validateInstallmentID(payment.installment_id)
    }



    private validateInstallmentID(installment_id: string | number): void {
        if (!installment_id) throw new CustomError('Insira a identificação do parcelamento!', 400)

        if (typeof installment_id !== 'string') {
            if (typeof installment_id !== 'number') {
                throw new CustomError('O formato não é válido', 400)
            }
        }

        installment_id = Number(installment_id)

        if (installment_id <= 0) {
            throw new CustomError('A identificação do parcelamento está incorreta!', 400)
        }

        return
    }
}



export default PaymentEntity