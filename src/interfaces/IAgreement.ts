export default interface IAgreement {
    agreement_id?: number;
    agreement_name: string;
    description?: string | null;
    registration_date: Date;
}