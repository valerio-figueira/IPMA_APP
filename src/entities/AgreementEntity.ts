import IAgreement from "../interfaces/IAgreement";

export default class AgreementSchema {
    agreement_id?: number;
    agreement_name: string;
    contract_number: number;
    description?: string | null;
    created_at?: Date;

    constructor(body: IAgreement) {
        this.agreement_id = body.agreement_id;
        this.agreement_name = body.agreement_name;
        this.contract_number = body.contract_number;
        this.description = body.description;
        this.created_at = body.created_at;
    }
}