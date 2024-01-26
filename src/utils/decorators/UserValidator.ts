import UserValidator from "../../controllers/validation/UserValidator";



function userValidator(userType: string, method: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const param = args[0]

            if (typeof param !== 'object') {
                throw new Error(`Validation failed, parameter must be an object.`)
            }

            if (method !== 'CREATE' && method !== 'UPDATE') {
                throw new Error(`O argumento passado é inválido.`)
            }

            if (userType === 'Holder') validateHolder(param, method)
            if (userType === 'UserData') validateUserData(param, method)
            if (userType === 'SSTeam') validateSSTeam(param, method)
            if (userType === 'Dependent') validateDependent(param, method)

            return originalMethod.apply(this, args)
        }

        return descriptor
    }
}





function validateHolder(param: Record<string, any>, method: string) {
    const length = Object.keys(param).length

    if (method === 'UPDATE') UserValidator.validateID(param.holder_id)

    if (length === 3 && method === 'UPDATE') {
        const result = checkHolderProperties(param)

        if (result) {
            UserValidator.validateStatus(param.status)
            return
        }
    }

    UserValidator.validateStatus(param.status)
    UserValidator.validate(param, method)
}






function checkHolderProperties(param: Record<string, any>) {
    const keyArr = ['holder_id', 'status', 'subscription_number']

    for (let key of keyArr) {
        if (!param.hasOwnProperty(key)) return false
    }

    return true
}






function validateDependent(param: Record<string, any>, method: string) {
    UserValidator.validateID(param.holder_id)
    UserValidator.validate(param, method)
}





function validateUserData(param: Record<string, any>, method: string) {
    if (method === 'UPDATE') UserValidator.validateID(param.user_id)
    UserValidator.validate(param, method)
}





function validateSSTeam(param: Record<string, any>, method: string) {
    UserValidator.validateRole(param.role)
    UserValidator.validate(param, method)
}

export default userValidator