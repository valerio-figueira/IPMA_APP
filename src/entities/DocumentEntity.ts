import { IDocument } from "../interfaces/IUser";

export class DocumentEntity {
    document_id?: number;
    user_id?: number;
    cpf: string;
    identity: string;
    issue_date: Date | null;
    issuing_authority: string;
    health_card: string | null;
    created_at?: Date;

    constructor(document: IDocument) {
        this.user_id = document.user_id;
        this.cpf = document.cpf;
        this.identity = document.identity;
        this.issue_date = document.issue_date;
        this.issuing_authority = document.issuing_authority;
        this.health_card = document.health_card;
        this.created_at = document.created_at;
    }
}

export default DocumentEntity