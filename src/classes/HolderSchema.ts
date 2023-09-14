import { IHolderBase } from "../interfaces/IHolder";

export class Holder implements IHolderBase {
    id_titular?: number;
    id_usuario?: number;
    matricula?: number | null;
    status: 'Ativo' | 'Aposentado' | 'LIP';

    constructor(data: IHolderBase) {
        this.id_titular = data.id_titular;
        this.id_usuario = data.id_usuario;
        this.matricula = data.matricula;
        this.status = data.status;
    }
}