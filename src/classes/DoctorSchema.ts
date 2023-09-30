import { IDoctor } from "../interfaces/IDoctor"

export default class DoctorSchema {
    codigo_prestador: number
    nome_medico: string
    especialidade: string
    localidade?: string | null
    cep?: string | null
    endereco?: string | null
    bairro?: string | null
    telefone?: string | null
    data_registro?: Date

    constructor(body: IDoctor) {
        this.codigo_prestador = body.codigo_prestador
        this.nome_medico = body.nome_medico
        this.especialidade = body.especialidade
        this.localidade = body.especialidade
        this.cep = body.cep
        this.endereco = body.endereco
        this.bairro = body.bairro
        this.telefone = body.telefone
        this.data_registro = body.data_registro
    }
}