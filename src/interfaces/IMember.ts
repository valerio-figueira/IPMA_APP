interface IMember {
    member_id?: number;
    holder_id: number;
    dependent_id?: number | null;
    agreement_id: number;
    agreement_card: string;
    active: boolean;
    created_at?: Date;
    exclusion_date?: Date | null;
}

export default IMember;
