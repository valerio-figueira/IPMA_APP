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
import AccessHierarchyService from "./AccessHierarchyService";
import Database from "../db/Database";
import { validateBody } from "../utils/decorators/validateBody";


export default class HolderService {
    holderRepository: HolderRepository
    accessHierarchyService: AccessHierarchyService

    constructor(db: Database) {
        this.holderRepository = new HolderRepository(db)
        this.accessHierarchyService = new AccessHierarchyService(db)
    }



    async Create(@validateBody body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)

        await this.checkIfHolderExists(holderData.document)

        return this.holderRepository.Create(holderData)
    }




    async ReadAll() {
        const holders = await this.holderRepository.ReadAll()

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




    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)
        const holderID = holderData.holder.holder_id
        const userID = holderData.user.user_id

        if (holderID) await this.ReadOne(holderID)
        if (userID) await this.userExists(userID)
        if (!holderData.holder) throw new CustomError('Falha ao processar os dados do titular', 400)

        return this.holderRepository.Update(holderData)
    }




    async Delete(holder_id: string | number) {
        const holder = await this.ReadOneSummary(holder_id)

        return this.holderRepository.Delete(holder);
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





    private async userExists(user_id: number) {
        const userInfo = await this.holderRepository
            .verifyIfUserExists(user_id)

        if (!userInfo) throw new CustomError('Dados de usuário inválido', 404)
    }




    private async checkPermissionLevel(hierarchy_id: number) {
        const permissionLevel = await this.accessHierarchyService
            .ReadOne(hierarchy_id)

        if (!permissionLevel) throw new CustomError('Nível de permissão não encontrado', 400)
        if (permissionLevel.level_name !== 'Common_User') {
            throw new CustomError('Todo titular deve ser um usuário comum', 400)
        }
    }




    private async checkIfHolderExists(document: DocumentEntity) {
        const holderFounded = await this.holderRepository
            .Exists(document)

        if (!holderFounded) return

        throw new CustomError('Titular já existe na base de dados', 400)
    }

}