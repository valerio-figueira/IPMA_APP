import HolderRepository from "../repositories/HolderRepository";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import ContactEntity from "../entities/ContactEntity";
import LocationEntity from "../entities/LocationEntity";
import CustomError from "../utils/CustomError";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import HolderBundleEntities from "../entities/HolderBundleEntities";
import HolderEntity from "../entities/HolderEntity";
import MemberEntity from "../entities/MemberEntity";


export default class HolderService {
    holderRepository: HolderRepository;

    constructor() {
        this.holderRepository = new HolderRepository();
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)

        if (body.username && body.password) {
            holderData.setAuthentication(body)
        }

        // SET MEMBER IF IT'LL BE A MEMBER OF ANY AGREEMENT

        return this.holderRepository.Create(holderData)
    }

    async ReadAll() {
        const holders = await this.holderRepository.ReadAll()

        if (holders.length === 0) throw new CustomError('Nenhum titular foi encontrado', 400)

        return holders
    }

    async ReadOne(holder_id: string | number) {
        const rawData = await this.holderRepository.ReadOne(holder_id);

        if (!rawData) throw new CustomError('Nenhum registro encontrado!', 400)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async ReadOneSummary(holder_id: string | number) {
        const rawData = await this.holderRepository.ReadOneSummary(holder_id);

        if (!rawData) throw new CustomError('Nenhum registro encontrado!', 400)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)

        if (!holderData.holder) throw new CustomError('Falha ao processar os dados do titular', 400)

        const rawData = await this.holderRepository
            .Update(holderData)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }

    private bundleEntities(body: any) {
        return new HolderBundleEntities({
            holder: new HolderEntity(body),
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            member: new MemberEntity(body)
        })
    }

}