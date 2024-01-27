interface IInstallment {
    installment_id?: number;
    member_id: number;
    total_amount: number;
    installment_amount: number;
    installment_count: number;
    start_date: Date;
    created_at?: Date;
}

export default IInstallment