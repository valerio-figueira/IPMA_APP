import IMember from "../interfaces/IMember";

export default class ContractRegistry {
    member_id?: number;
    holder_id: number;
    dependent_id?: number | null;
    agreement_id: number;
    agreement_card: string;
    active: boolean;
    exclusion_date?: Date | null;
    created_at?: Date;

    constructor(body: IMember) {
        this.member_id = body.member_id;
        this.holder_id = body.holder_id;
        this.dependent_id = body.dependent_id;
        this.agreement_id = body.agreement_id;
        this.agreement_card = body.agreement_card;
        this.active = body.active;
        this.exclusion_date = body.exclusion_date;
        this.created_at = body.created_at;
    }
}