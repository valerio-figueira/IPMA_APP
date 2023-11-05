import CustomError from "../../utils/CustomError";
import IMember from "../../interfaces/IMember";

export default class MemberValidator {

    static validate(data: IMember) {
        // Verifique se os campos obrigatórios estão presentes
        if (!data.agreement_id && !data.holder_id) throw new CustomError('Verifique os campos obrigatórios', 400)

        //this.isNumber(data)
    }

    static validateMember(data: IMember) {
        if(!data.member_id) throw new CustomError('Não é possível excluir um membro sem especificar a identificação', 400)
        if(typeof data.member_id !== 'number') throw new CustomError('Verifique a identificação do conveniado', 400)
    }

    static isNumber(data: IMember) {
        if(typeof data.agreement_id !== 'number') throw new CustomError('Verifique a identificação do convênio', 400)
        if(data.dependent_id) {
            if(typeof data.dependent_id !== 'number') throw new CustomError('Verifique a identificação do dependente', 400)
        }
        if(typeof data.holder_id !== 'number') throw new CustomError('Verifique a identificação do titular', 400)
    }
}