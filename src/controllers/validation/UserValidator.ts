import TBody from "../../types/TBodyReq";
import CustomError from "../../utils/CustomError";

export default class UserValidator {

    static validate(data: TBody) {
        if (!data.name) throw new CustomError('Digite o nome', 400)
        if (!data.cpf) throw new CustomError('Digite o número do CPF', 400)

        this.validateStringOrNumber(data)
        this.validateName(data.name)
        this.validateStatus(data.status)
        this.validateDate(data.birth_date as string)
        this.validateDate(data.issue_date as string)

        return
    }




    static validateName(name: string) {
        const regex = /^[a-zA-ZÀ-ÿ\'\s]+$/

        if (typeof name !== 'string') throw new CustomError('O nome não é válido!', 400)
        if (!regex.test(name)) throw new CustomError('O nome não é válido!', 400)
    }




    static validateIdentity(identity: string | undefined) {
        if (!identity) return
        const regex = /^[a-zA-Z]*\d+[a-zA-Z\d]*$/

        if (typeof identity !== 'string') throw new CustomError('O RG não é válido!', 400)
        if (!regex.test(identity)) throw new CustomError('O RG não é válido!', 400)
    }




    static validateIdentifications(data: any) {
        // this.hasUserIdentification(data)
        this.hasHolderIdentification(data)
    }





    static validateDate(date: string | null) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (typeof date !== 'string') throw new CustomError('Data inválida', 400)
        if (date === '') return
        if (date !== null) {
            if (!regex.test(date)) {
                throw new CustomError('Data inválida', 400)
            }
        }
    }





    static validateMaritalStatus(value: string | undefined) {
        if (!value) return
        const mandatoryValues = [
            'CASADO(A)',
            'SOLTEIRO(A)',
            'DIVORCIADO(A)',
            'VIUVO(A)',
            'UNIAO ESTAVEL'
        ]

        if (!mandatoryValues.includes(value)) {
            throw new CustomError('O estado civil não é válido!', 400)
        }
    }





    static validateStringOrNumber(data: TBody) {
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
        if (!data.user_id) throw new CustomError('Não foi possível validar a identificação de usuário', 400)
    }





    static hasHolderIdentification(data: any) {
        if (!data.holder_id) throw new CustomError('Não foi possível validar a identificação de titular', 400)
    }
}