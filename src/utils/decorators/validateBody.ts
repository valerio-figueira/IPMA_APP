import CustomError from "../CustomError";
import { BadRequest } from "../messages/APIResponse";




export function validateUser(userType: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const param = args[0]

            if (typeof param !== 'object') {
                throw new Error(`Validation failed, parameter must be an object.`);
            }

            if (userType === 'Holder') validateStatus(param.status)
            if (userType === 'SSTeam') validateRole(param.role)
            validateStringOrNumber(param)
            validateCPF(param.cpf)
            validateDate(param.birth_date)
            validateDate(param.issue_date)

            return originalMethod.apply(this, args);
        };

        return descriptor;
    }
}





function validateCPF(cpf: string) {
    const regex = [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, /^\d{11}$/]
    const message = 'CPF inválido'

    if (cpf === '') throw new CustomError(message, 400)
    if (cpf === null) throw new CustomError(message, 400)
    if (cpf === undefined) throw new CustomError(message, 400)
    if (regex[1].test(cpf)) return
    if (!regex[0].test(cpf)) throw new CustomError(message, 400)
}





function validateDate(date: string | null) {
    const regex = [/^\d{4}-\d{2}-\d{2}$/, /^\d{4}\/\d{2}\/\d{2}$/];
    if (date === '') return
    if (date !== null) {
        if (regex[1].test(date)) return
        if (!regex[0].test(date)) {
            throw new CustomError('Data inválida', 400)
        }
    }
}




function validateStringOrNumber(data: Record<string, string | number>) {
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




function validateStatus(value: string) {
    if (value === 'ATIVO(A)') return
    if (value === 'APOSENTADO(A)') return
    if (value === 'LICENÇA') return

    throw new CustomError('Status inválido', 400)
}




function validateRole(value: string) {
    if (typeof value !== 'string') throw new CustomError('Formato inválido', 400)
    if (value === '') throw new CustomError('Insira o cargo', 400)
    if (value.length < 4) throw new CustomError('Insira um cargo válido', 400)

    return
}




function validateID(value: number) {
    const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

    if (!value) throw ERROR
    if (typeof value !== 'number') throw ERROR
}



function validateStringField(value: string) {
    const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

    if (!value) throw ERROR
    if (typeof value !== 'string') throw ERROR
    if (value.length < 4) throw ERROR
}


export function validate(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
        const param = args[0]
        const ERROR = new Error(`Validation failed, parameter must be an object`)

        if (typeof param !== 'object') throw ERROR

        validateStringOrNumber(param)
        validateID(param.user_id)
        validateID(param.hierarchy_id)
        validateStringField(param.username)
        validateStringField(param.password)

        return originalMethod.apply(this, args);
    };

    return descriptor;
}