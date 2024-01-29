interface IInstallment {
    installment_id?: number;
    member_id: number;
    total_amount: number;
    installment_amount: number;
    installment_count: number;
    description: string;
    start_date: Date;
    reference_month: number;
    reference_year: number;
    created_at?: Date;
}

export default IInstallment