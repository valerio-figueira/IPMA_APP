import IBusinessContract from "../interfaces/IBusinessContract";

export default class BusinessContractSchema {
    id_convenio?: number;
    nome_convenio: string;
    descricao?: string | null;
    data_registro: Date;

    constructor(body: IBusinessContract) {
        this.id_convenio = body.id_convenio;
        this.nome_convenio = body.nome_convenio;
        this.descricao = body.descricao;
        this.data_registro = body.data_registro;
    }
}