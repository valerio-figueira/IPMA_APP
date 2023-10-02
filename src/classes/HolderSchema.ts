import { IHolderBase } from "../interfaces/IHolder";

export class Holder implements IHolderBase {
    holder_id?: number;
    user_id?: number;
    registration_number?: number | null;
    status: 'Ativo' | 'Aposentado' | 'Licença';

    constructor(data: IHolderBase) {
        this.holder_id = data.holder_id;
        this.user_id = data.user_id;
        this.registration_number = data.registration_number;
        this.status = data.status;
    }
}