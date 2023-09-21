export default interface IBusinessContract {
    id_convenio: number;
    nome_convenio: string;
    descricao?: string | null;
    data_registro: Date;
}