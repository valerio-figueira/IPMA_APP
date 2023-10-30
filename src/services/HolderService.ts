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
import Database from "../db/Database";
import { validateUser } from "../utils/decorators/validateBody";
import UserService from "./UserService";


export default class HolderService {
    holderRepository: HolderRepository
    userService: UserService

    constructor(db: Database) {
        this.holderRepository = new HolderRepository(db)
        this.userService = new UserService(db)
    }


    @validateUser('Holder')
    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)

        await this.userService.Exists(holderData.document)

        return this.holderRepository.Create(holderData)
    }




    async ReadAll(query: any) {
        const holders = await this.holderRepository.ReadAll(query)

        if (holders.length === 0) throw new CustomError('Nenhum titular foi encontrado', 400)

        return holders
    }




    async ReadOne(holder_id: string | number) {
        const holderData = await this.holderRepository.ReadOne(holder_id);

        if (!holderData) throw new CustomError('Nenhum registro encontrado!', 400)

        return holderData
    }




    async ReadOneSummary(holder_id: string | number) {
        const holderData = await this.holderRepository.ReadOneSummary(holder_id);

        if (!holderData) throw new CustomError('Nenhum registro encontrado!', 400)

        return holderData
    }



    @validateUser('Holder')
    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)
        const holderID = holderData.holder.holder_id
        const userID = holderData.user.user_id

        if (holderID) await this.ReadOne(holderID)
        if (userID) await this.userService.throwErrorIfNotExists(userID)
        if (!holderData.holder) throw new CustomError('Falha ao processar os dados do titular', 400)

        return this.holderRepository.Update(holderData)
    }




    async Delete(holder_id: string | number) {
        const holder = await this.ReadOneSummary(holder_id)

        return this.holderRepository.Delete(holder);
    }




    async findHolderByUserId(user_id: string | number) {
        return this.holderRepository.findHolderByUserId(user_id)
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