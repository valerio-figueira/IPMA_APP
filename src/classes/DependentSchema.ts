import { IDependentBase } from "../interfaces/IDependent";

export class Dependent implements IDependentBase {
    id_dependente?: number;
    id_usuario?: number;
    id_titular: number;
    grau_parentesco: string | null;

    constructor(data: IDependentBase) {
        this.id_dependente = data.id_dependente;
        this.id_usuario = data.id_usuario;
        this.id_titular = data.id_titular;
        this.grau_parentesco = data.grau_parentesco;
    }
}