import { IHolderBase } from "../interfaces/IHolder";

export class Holder implements IHolderBase {
    holder_id?: number;
    user_id?: number;
    subscription_number?: number | null;
    status: 'ATIVO(A)' | 'APOSENTADO(A)' | 'LICENÇA';
    created_at?: Date;

    constructor(data: IHolderBase) {
        this.holder_id = data.holder_id;
        this.user_id = data.user_id;
        this.subscription_number = data.subscription_number;
        this.status = data.status;
        this.created_at = data.created_at;
    }
}