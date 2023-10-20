import CustomError from "../CustomError";


export function validateUser(userType: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const param = args[0]; // Assumindo que o CPF é o primeiro parâmetro

            if (typeof param !== 'object') {
                throw new Error(`Validation failed, parameter must be an object.`);
            }
            console.log("DECORATOR PARAMS")
            console.log(param)

            if (userType === 'Holder') validateStatus(param.status)
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