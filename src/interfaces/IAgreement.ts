export default interface IAgreement {
    agreement_id?: number;
    agreement_name: string;
    contract_number: number;
    description?: string | null;
    created_at?: Date;
}