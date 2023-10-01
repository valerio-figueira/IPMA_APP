import IAgreement from "../interfaces/IAgreement";

export default class AgreementSchema {
    agreement_id?: number;
    agreement_name: string;
    description?: string | null;
    registration_date: Date;

    constructor(body: IAgreement) {
        this.agreement_id = body.agreement_id;
        this.agreement_name = body.agreement_name;
        this.description = body.description;
        this.registration_date = body.registration_date;
    }
}