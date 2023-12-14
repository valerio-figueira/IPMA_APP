export default interface IAppointment {
    appointment_id?: number;
    member_id?: number;
    description: string;
    contract_number: number;
    amount: number;
    total_amount: number;
    appointment_date: Date;
    reference_month: number;
    reference_year: number;
    cpf?: string;
    created_at?: Date;
}