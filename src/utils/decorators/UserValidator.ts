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
                throw new Error(`O decorator tem um parâmetro inválido.`)
            }

            if (userType === 'Holder') {
                UserValidator.validateStatus(param.status)
                if (method === 'UPDATE') UserValidator.validateID(param.holder_id)
            }

            if (userType === 'UserData') {
                if (method === 'UPDATE') UserValidator.validateID(param.user_id)
            }

            if (userType === 'SSTeam') UserValidator.validateRole(param.role)
            if (userType === 'Dependent') UserValidator.validateID(param.holder_id)

            UserValidator.validate(param, method)

            return originalMethod.apply(this, args)
        }

        return descriptor
    }
}



export default userValidator