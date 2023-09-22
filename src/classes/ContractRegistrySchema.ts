export default class ContractRegistry {
    id_conveniado?: number;
    id_titular: number;
    id_dependente: number | null;
    id_convenio: number;
    ativo: boolean;
    data_exclusao?: Date | null;

    constructor(
        id_conveniado: number,
        id_titular: number,
        id_dependente: number | null,
        id_convenio: number,
        ativo: boolean,
        data_exclusao: Date | null
    ) {
        this.id_conveniado = id_conveniado;
        this.id_titular = id_titular;
        this.id_dependente = id_dependente;
        this.id_convenio = id_convenio;
        this.ativo = ativo;
        this.data_exclusao = data_exclusao;
    }
}