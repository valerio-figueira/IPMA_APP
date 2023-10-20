import AgreementRepository from "../repositories/AgreementRepository";
import AgreementSchema from "../entities/AgreementEntity";
import IAgreement from "../interfaces/IAgreement";
import CustomError from "../utils/CustomError";
import AgreementModel from "../models/AgreementModel";
import Database from "../db/Database";

export default class AgreementService {
    private agreementRepository: AgreementRepository;

    constructor(db: Database) {
        this.agreementRepository = new AgreementRepository(db);
    }





    async Create(body: IAgreement) {
        const agreement = new AgreementSchema(body);

        return this.agreementRepository.Create(agreement);
    }





    async ReadAll() {
        const agreement = await this.agreementRepository.ReadAll();

        if (agreement.length === 0) throw new CustomError('Nenhum convênio registrado', 404)

        return agreement;
    }





    async ReadOne(agreement_id: string | number) {
        const contract = await this.agreementRepository.ReadOne(agreement_id);

        if (!contract) throw new CustomError('O Convênio não foi alterado ou localizado', 404)

        return contract
    }





    async Update(body: IAgreement) {
        const agreement = new AgreementSchema(body);

        if (!agreement.agreement_id) throw new CustomError('Convênio não localizado', 404)

        const [affectedCount] = await this.agreementRepository.Update(agreement);

        if (!affectedCount) throw new CustomError('O Convênio não foi alterado ou localizado', 404)

        return await AgreementModel.findByPk(agreement.agreement_id)
    }





    async Delete(body: IAgreement) {
        if (!body.agreement_id) throw new CustomError('Convênio não localizado', 404)
        const contract = await this.agreementRepository.Delete(body);

        if (!contract) throw new CustomError('O Convênio não foi removido ou localizado', 400)

        return { message: 'Convênio removido com sucesso!' }
    }

}