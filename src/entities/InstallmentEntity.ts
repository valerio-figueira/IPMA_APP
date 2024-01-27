import IInstallment from "../interfaces/IInstallment";

export class InstallmentEntity {
    installment_id?: number;
    member_id: number;
    total_amount: number;
    installment_amount: number;
    installment_count: number;
    start_date: Date;
    created_at?: Date;

    constructor(installment: IInstallment) {
        this.installment_id = installment.installment_id;
        this.member_id = installment.member_id;
        this.total_amount = installment.total_amount;
        this.installment_amount = installment.installment_amount;
        this.installment_count = installment.installment_count;
        this.start_date = installment.start_date;
        this.created_at = installment.created_at;
    }
}

export default InstallmentEntity