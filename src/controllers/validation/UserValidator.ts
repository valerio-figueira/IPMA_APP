import CustomError from "../../utils/CustomError";
import { IHolderRequest } from "../../interfaces/IHolder";

export default class UserValidator {

    static validate(data: IHolderRequest) {
        // Verifique se os campos obrigatórios estão presentes
        if (!data.name || !data.cpf || !data.identity) {
            throw new CustomError('Verifique os campos obrigatórios', 400)
        }

        this.validateStatus(data.status)
        this.validateStringOrNumber(data)
        this.validateDate(data.birth_date)
        this.validateDate(data.issue_date)

        return
    }

    static validateIdentifications(data: any) {
        this.hasUserIdentification(data)
        this.hasHolderIdentification(data)
    }

    static validateDate(date: string | null) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (date === '') return
        if (date !== null) {
            if (!regex.test(date)) {
                throw new CustomError('Data inválida', 400)
            }
        }
    }

    static validateStringOrNumber(data: IHolderRequest) {
        for (let key in data) {
            if (typeof data[key] !== 'string') {
                if (typeof data[key] !== 'number') {
                    if (data[key] !== null) {
                        throw new CustomError('Erro na validação dos dados', 400)
                    }
                }
            }
        }
    }

    static isValidCPF(cpf: string): boolean {
        return true
    }

    static isValidDate(dateStr: string): boolean {
        return true
    }

    static validateStatus(value: any) {
        if (value === 'ATIVO(A)') return
        if (value === 'APOSENTADO(A)') return
        if (value === 'LICENÇA') return

        throw new CustomError('Status inválido', 400)
    }

    static hasUserIdentification(data: any) {
        if(!data.user_id) throw new CustomError('Não foi possível validar a identificação de usuário', 400)
    }

    static hasHolderIdentification(data: any) {
        if(!data.holder_id) throw new CustomError('Não foi possível validar a identificação de titular', 400)
    }
}