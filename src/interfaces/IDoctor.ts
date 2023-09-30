export interface IDoctor {
    id_medico: number;
    codigo_prestador: number;
    nome_medico: string;
    especialidade: string;
    localidade: string | null;
    cep: string | null;
    endereco: string | null;
    bairro: string | null;
    telefone: string | null;
    data_registro: Date
}