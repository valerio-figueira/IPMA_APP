import CustomError from "../CustomError";
import { BadRequest } from "../messages/APIResponse";
import UserValidator from "../../controllers/validation/UserValidator";



export function validateUser(userType: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const param = args[0]

            if (typeof param !== 'object') {
                throw new Error(`Validation failed, parameter must be an object.`)
            }

            if (userType === 'Holder') UserValidator.validateStatus(param.status)
            if (userType === 'SSTeam') UserValidator.validateRole(param.role)
            if (userType === 'Dependent') UserValidator.validateID(param.holder_id)

            UserValidator.validate(param)

            return originalMethod.apply(this, args)
        }

        return descriptor
    }
}






function validateStringField(value: string) {
    const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

    if (!value) throw ERROR
    if (typeof value !== 'string') throw ERROR
    if (value.length < 4) throw ERROR
}
