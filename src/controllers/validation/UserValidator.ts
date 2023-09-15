import CustomError from "../../classes/CustomError";
import { IHolderRequest } from "../../interfaces/IHolder";

export default class UserValidator {

    static validate(data: IHolderRequest) {
        // Verifique se os campos obrigatórios estão presentes
        if (!data.nome || !data.cpf || !data.identidade) {
            throw new CustomError('Verifique os campos obrigatórios', 400)
        }

        this.validateStringOrNumber(data)

        return
    }

    static validateStringOrNumber(data: IHolderRequest) {
        for (let key in data) {
            if (typeof data[key] !== 'string') {
                if(typeof data[key] !== 'number') {
                    if(data[key] !== null) {
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
}