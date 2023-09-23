import IContractRegistry from "../interfaces/IContractRegistry";

export default class ContractRegistrySchema {
    id_conveniado?: number;
    id_titular: number;
    id_dependente?: number | null;
    id_convenio: number;
    ativo: boolean;
    data_exclusao?: Date | null;

    constructor(body: IContractRegistry) {
        this.id_conveniado = body.id_conveniado;
        this.id_titular = body.id_titular;
        this.id_dependente = body.id_dependente;
        this.id_convenio = body.id_convenio;
        this.ativo = body.ativo;
        this.data_exclusao = body.data_exclusao;
    }
}