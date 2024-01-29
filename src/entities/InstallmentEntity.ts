import IInstallment from "../interfaces/IInstallment";

export class InstallmentEntity {
    installment_id?: number;
    member_id: number;
    total_amount: number;
    installment_amount: number;
    installment_count: number;
    description: string;
    reference_month: number;
    reference_year: number;
    start_date: Date;
    created_at?: Date;

    constructor(installment: IInstallment) {
        this.installment_id = installment.installment_id;
        this.member_id = installment.member_id;
        this.total_amount = installment.total_amount;
        this.installment_amount = installment.installment_amount;
        this.installment_count = installment.installment_count;
        this.description = installment.description;
        this.reference_month = installment.reference_month;
        this.reference_year = installment.reference_year;
        this.start_date = installment.start_date;
        this.created_at = installment.created_at;
    }
}

export default InstallmentEntity