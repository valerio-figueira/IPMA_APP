import AuthenticationRepository from "../repositories/AuthenticationRepository";
import CustomError from "../utils/CustomError";
import AuthenticationEntity from "../entities/AuthenticationEntity";
import UserService from "./UserService";
import IAuthentication from "../interfaces/IAuthentication";
import Database from "../db/Database";
import { BadRequest } from "../utils/messages/APIResponse";
import AccessHierarchyService from "./AccessHierarchyService";
import { validate } from "../utils/decorators/validateBody";
import HolderService from "./HolderService";
import SocialSecurityTeamService from "./SocialSecurityTeamService";


export default class AuthenticationService {
    private authenticationRepository: AuthenticationRepository
    private accessHierarchyService: AccessHierarchyService
    private SSTeamService: SocialSecurityTeamService
    private userService: UserService
    private holderService: HolderService

    constructor(db: Database) {
        this.authenticationRepository = new AuthenticationRepository(db)
        this.accessHierarchyService = new AccessHierarchyService(db)
        this.SSTeamService = new SocialSecurityTeamService(db)
        this.userService = new UserService(db)
        this.holderService = new HolderService(db)
    }


    @validate
    async Create(body: AuthenticationEntity) {
        const authEntity = new AuthenticationEntity(body)

        if (!authEntity.user_id || !authEntity.hierarchy_id)
            throw new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

        // THE USER IS HOLDER, DEPENDENT OR MEMBER OF ORGANIZATION?
        await this.userService.throwErrorIfNotExists(authEntity.user_id)
        const userType = await this.findTypeOfUser(authEntity.user_id)

        this.verifyPermissionLevel(userType, authEntity.hierarchy_id)

        return this.authenticationRepository.Create(authEntity)
    }




    async ReadAll() {
        return this.authenticationRepository.ReadAll()
    }




    async ReadOne(auth_id: string | number) {
        return this.authenticationRepository.ReadOne(auth_id)
    }




    async Update(query: IAuthentication) {
        if (!query.authentication_id) throw new CustomError('É necessário a identificação', 400)

        const [affectedCount] = await this.authenticationRepository.Update(query)

        if (affectedCount === 0) throw new CustomError('Nenhum dado foi alterado', 400)

        return this.ReadOne(query.authentication_id)
    }





    async Delete(auth_id: string | number) {
        return this.authenticationRepository.Delete(auth_id)
    }





    private async findTypeOfUser(user_id: string | number) {
        const holder = await this.holderService
            .findHolderByUserId(user_id)

        if (holder) return 'Holder'

        const sstMember = await this.SSTeamService
            .findMemberByUserId(user_id)

        if (sstMember) return 'SSTMember'

        throw new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)
    }





    private async verifyPermissionLevel(userType: string, hierarchy_id: number) {
        const ERROR = new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)
        const permissionLevel = await this.accessHierarchyService
            .ReadOne(hierarchy_id)

        if (!permissionLevel) throw ERROR
        const levelName = permissionLevel.level_name

        if (levelName.match('Root')) throw ERROR

        if (userType.match('Holder')) {
            // CHECK IF HIERARCHY LEVEL IS FOR COMMON USER
            if (!levelName.match('Common_User')) throw ERROR
        }

        if (userType.match('Dependent')) {
            if (!levelName.match('Common_User')) throw ERROR
        }

        if (userType.match('SSTMember')) {
            if (levelName.match('Administrator')) throw ERROR
            if (levelName.match('Advanced_Employee')) return
            if (levelName.match('Common_Employee')) return
        }
    }



}