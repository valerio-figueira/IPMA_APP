import IAgreement from "../interfaces/IAgreement";
import AgreementModel from "../models/AgreementModel";

export default class AgreementRepository {

    constructor() { }

    async Create(query: IAgreement) {
        return await AgreementModel.create(query, { raw: true })
    }

    async ReadAll() {
        return AgreementModel.findAll({ raw: true })
    }

    async ReadOne(agreement_id: string | number) {
        return AgreementModel.findOne({
            where: { agreement_id },
            raw: true
        })
    }

    async Update(query: IAgreement) {
        return AgreementModel.update(query, {
            where: { agreement_id: query.agreement_id }
        })
    }

    async Delete(query: IAgreement) {
        return AgreementModel.destroy({
            where: { agreement_id: query.agreement_id }
        })
    }

}