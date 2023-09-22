import CustomError from "../../utils/CustomError";
import IContractRegistry from "../../interfaces/IContractRegistry";

export default class ContractRegistryValidator {

    static validate(data: IContractRegistry) {
        // Verifique se os campos obrigatórios estão presentes
        if (!data.id_convenio && !data.id_titular) throw new CustomError('Verifique os campos obrigatórios', 400)

        this.isNumber(data)
    }

    static validateMember(data: IContractRegistry) {
        if(!data.id_conveniado) throw new CustomError('Não é possível excluir um membro sem especificar a identificação', 400)
        if(typeof data.id_conveniado !== 'number') throw new CustomError('Verifique a identificação do conveniado', 400)
    }

    static isNumber(data: IContractRegistry) {
        if(typeof data.id_convenio !== 'number') throw new CustomError('Verifique a identificação do convênio', 400)
        if(data.id_dependente) {
            if(typeof data.id_dependente !== 'number') throw new CustomError('Verifique a identificação do dependente', 400)
        }
        if(typeof data.id_titular !== 'number') throw new CustomError('Verifique a identificação do titular', 400)
    }
}