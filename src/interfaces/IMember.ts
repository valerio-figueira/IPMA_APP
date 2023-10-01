interface IMember {
    member_id?: number;
    holder_id: number;
    dependent_id?: number | null;
    agreement_id: number;
    agreement_card: string;
    active: boolean;
    registration_date?: Date;
    exclusion_date?: Date | null;
}

export default IMember;
