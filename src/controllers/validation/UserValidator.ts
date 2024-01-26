import { format } from "date-fns";
import CustomError from "../../utils/CustomError";
import { BadRequest } from "../../utils/messages/APIResponse";




export default class UserValidator {


    static validate(body: Record<string, any>, method: string) {
        if (method === 'CREATE') this.validateCPF(body.cpf)
        this.validateStringOrNumber(body)
        this.validateName(body.name)
        this.validateGender(body.gender)
        this.validateFatherName(body.father_name)
        this.validateMotherName(body.mother_name)
        this.validateDate(body.birth_date)
        this.validateIdentity(body.identity)
        this.validateDate(body.issue_date)
        this.validateHealthCard(body.health_card)
        this.validateMaritalStatus(body.marital_status)
        this.validateEmail(body.email)
        this.validateAddress(body.address)
        this.validateAddressNumber(body.number)
        this.validatePisPasep(body.pis_pasep)
        this.validateResidentialPhoneNumber(body.residential_phone)
        this.validatePhoneNumber(body.phone_number)

        return
    }






    static validateName(name: string) {
        const regex = /^[a-zA-ZÀ-ÿ\'\s]+$/
        if (!name) throw new CustomError('Digite o nome do usuário!', 400)
        if (typeof name !== 'string') throw new CustomError('O nome não é válido!', 400)
        if (!regex.test(name)) throw new CustomError('O nome não é válido!', 400)
    }






    static validateRelationshipDegree(value: string | null) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato de dados inválido para ', 400)

        const mandatoryValues = [
            'CONJUGE(A)',
            'COMPANHEIRO(A)',
            'FILHO(A)',
            'ENTEADO(A)',
            'PAI/MAE',
            'SOGRO(A)',
            'NETO(A)',
            'IRMAO(A)',
            'GENRO/NORA',
            'PRIMO(A)'
        ]

        if (!mandatoryValues.includes(value)) throw new CustomError('O grau de parentesco não é válido!', 400)
    }






    static validateIdentity(identity: string | undefined) {
        if (!identity) return
        if (typeof identity !== 'string') throw new CustomError('O formato do RG não é válido!', 400)

        const regexArr = [
            /^[A-z]{2}\d{8}$/,
            /^[A-z]{2}-\d{8}$/,
            /^[A-z]{1}-\d{2}\.\d{3}\.\d{3}$/,
            /^[A-z]{2}-\d{2}\.\d{3}\.\d{3}$/,
            /^[A-z]{1}\d{7,8}$/,
            /^\d{5,9}$/,
        ]

        for (let regex of regexArr) {
            if (regex.test(identity)) return
        }

        throw new CustomError(`
        O RG não é válido! 
        Siga um dos formatos: 
        UF-00000000, UF00000000, UF-00.000.000, U-00.000.000, 
        U00000000 ou apenas números.`, 400)
    }






    static validateIdentifications(data: any) {
        // this.hasUserIdentification(data)
        this.hasHolderIdentification(data)
    }






    static validateDate(date: string | null) {
        if (!date) return
        if (typeof date !== 'string') throw new CustomError('Data inválida', 400)

        const regexArr = [
            /^\d{2}-\d{2}-\d{4}$/,
            /^\d{4}\/\d{2}\/\d{2}$/,
            /^\d{4}-\d{2}-\d{2}$/,
            /^\d{2}\/\d{2}\/\d{4}$/
        ]

        for (let regex of regexArr) {
            if (regex.test(date)) return
        }

        if (typeof date === 'object') {
            const convertedDate = format(new Date(date), 'dd-MM-yyyy')
            if (regexArr[0].test(convertedDate)) return
        }

        throw new CustomError('Data inválida', 400)
    }





    static validateStringOrNumber(data: Record<string, string | number>) {
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









    static hasUserIdentification(data: any) {
        if (!data.user_id) throw new CustomError('Não foi possível validar a identificação de usuário', 400)
    }







    static hasHolderIdentification(data: any) {
        if (!data.holder_id) throw new CustomError('Não foi possível validar a identificação de titular', 400)
    }








    static validatePisPasep(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o PIS/PASEP', 400)

        const regex = [/^\d{11}$/, /^\d{3}\.\d{5}\.\d{2}-\d{1}$/]

        if (!regex[0].test(value) && !regex[1].test(value)) {
            throw new CustomError('O PIS/PASEP é inválido, siga o padrão: 000.00000.00-0 ou apenas números (11 dígitos)', 400)
        }
    }






    static validateGender(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o gênero da pessoa', 400)

        const mandatoryValues = ['MASCULINO', 'FEMININO', 'OUTRO']

        if (!mandatoryValues.includes(value)) throw new CustomError('O gênero da pessoa é inválido', 400)
    }






    static validateAddress(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o endereço', 400)

        const regex = /^[a-zA-Z0-9\s.,\-']+$/

        if (!regex.test(value)) throw new CustomError('O endereço é inválido', 400)
    }





    static validateResidentialPhoneNumber(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o telefone residencial', 400)

        const regex = /^\(\d{2}\)\s\d{4}-\d{4}/

        if (!regex.test(value)) throw new CustomError('', 400)
    }






    static validatePhoneNumber(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o número de telefone celular', 400)

        const regex = /^\(\d{2}\)\s\d{5}-\d{4}/

        if (!regex.test(value)) throw new CustomError('', 400)
    }







    static validateAddressNumber(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('Formato inválido para o número do endereço', 400)

        const regex = /^[0-9]{1,6}$/

        if (!regex.test(value)) throw new CustomError('O número de endereço é inválido', 400)
    }






    static validateEmail(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('O formato do e-mail é inválido', 400)

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if (!regex.test(value)) throw new CustomError('O e-mail é inválido', 400)
    }






    static validateCPF(cpf: string) {
        if (typeof cpf !== 'string') throw new CustomError('O formato do CPF é inválido', 400)

        const regex = [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, /^\d{11}$/]
        const message = 'O número do CPF é inválido'

        if (cpf === '') throw new CustomError(message, 400)
        if (cpf === null) throw new CustomError(message, 400)
        if (cpf === undefined) throw new CustomError(message, 400)
        if (regex[1].test(cpf)) return
        if (!regex[0].test(cpf)) throw new CustomError(message, 400)
    }






    static validateHealthCard(value: string) {
        if (!value) return
        if (typeof value !== 'string') throw new CustomError('O formato para o cartão de saúde é inválido', 400)

        const regex = /^\d{3}\s\d{4}\s\d{4}\s\d{4}$/

        if (!regex.test(value)) throw new CustomError('O número para o cartão de saúde não é valido, siga o padrão: 000 0000 0000 0000.', 400)
    }







    static validateFatherName(name: string) {
        if (!name) return
        const regex = /^[a-zA-ZÀ-ÿ\'\s]+$/

        if (typeof name !== 'string') throw new CustomError('O nome do pai não é válido!', 400)
        if (!regex.test(name)) throw new CustomError('O nome do pai não é válido!', 400)
    }





    static validateMotherName(name: string) {
        if (!name) return
        const regex = /^[a-zA-ZÀ-ÿ\'\s]+$/

        if (typeof name !== 'string') throw new CustomError('O nome da mãe não é válido!', 400)
        if (!regex.test(name)) throw new CustomError('O nome da mãe não é válido!', 400)
    }





    static validateStatus(value: string) {
        if (typeof value !== 'string') throw new CustomError('Status inválido', 400)
        const mandatoryValues = ['EFETIVO(A)', 'APOSENTADO(A)', 'PENSIONISTA', 'LICENÇA', 'CONTRATO']

        if (mandatoryValues.includes(value)) return

        throw new CustomError('Status inválido', 400)
    }






    static validateRole(value: string) {
        if (typeof value !== 'string') throw new CustomError('Formato inválido', 400)
        if (value === '') throw new CustomError('Insira o cargo', 400)
        if (value.length < 4) throw new CustomError('Insira um cargo válido', 400)

        return
    }





    static validateID(value: number | string) {
        const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

        if (!value) throw ERROR
        if (typeof value === 'number') return
        if (typeof value === 'string') return
        throw ERROR
    }





    static validateStringField(value: string) {
        const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

        if (!value) throw ERROR
        if (typeof value !== 'string') throw ERROR
        if (value.length < 4) throw ERROR
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
}