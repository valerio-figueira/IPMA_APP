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
import ERROR from "../utils/errors/Errors";
import PasswordEncryption from "../secure/PasswordEncryption";


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
        await this.throwErrorIfAlreadyExists(authEntity.user_id)
        await this.verifyIfUsernameExists(authEntity.username)
        await this.userService.throwErrorIfNotExists(authEntity.user_id)
        const userType = await this.findTypeOfUser(authEntity.user_id)

        await this.verifyPermissionLevel(userType, authEntity.hierarchy_id)
        authEntity.password = await PasswordEncryption.createHash(authEntity.password, 10)

        return this.authenticationRepository.Create(authEntity)
    }




    async ReadAll() {
        return this.authenticationRepository.ReadAll()
    }




    async ReadOne(auth_id: string | number) {
        return this.authenticationRepository.ReadOne(auth_id)
    }



    //@validate
    async Update(query: IAuthentication) {
        if (!query.authentication_id) throw ERROR.UserIdRequired
        query.password = await PasswordEncryption.createHash(query.password, 10)

        const [affectedCount] = await this.authenticationRepository.Update(query)

        if (affectedCount === 0) throw ERROR.NotChanged

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




    // FUTURAMENTE: ESTRUTURAR AS HIERARQUIAS EM UMA ESTRUTURA DE DADOS
    private async verifyPermissionLevel(userType: string, hierarchy_id: number) {
        const permissionLevel = await this.accessHierarchyService
            .ReadOne(hierarchy_id)

        if (!permissionLevel) throw ERROR.BadRequest
        const levelName = permissionLevel.level_name

        // if (levelName.match('Root')) throw ERROR.BadRequest

        if (userType === 'Holder') {
            // CHECK IF HIERARCHY LEVEL IS FOR COMMON USER
            if (levelName !== 'Common_User') throw ERROR.BadRequest
        }

        if (userType === 'Dependent') {
            if (levelName !== 'Common_User') throw ERROR.BadRequest
        }

        if (userType === 'SSTMember') {
            if (levelName === 'Administrator') throw ERROR.BadRequest
            if (levelName === 'Advanced_Employee') return
            if (levelName === 'Common_Employee') return
        }
    }



    private async throwErrorIfAlreadyExists(user_id: string | number) {
        const exists = await this.authenticationRepository
            .findByUserId(user_id)

        if (exists) throw new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

        return
    }



    private async verifyIfUsernameExists(username: string) {
        const prohibitedValues = ['Root', 'Administrator']
        const exists = await this.authenticationRepository
            .findByUsername(username)

        if (exists && prohibitedValues.includes(exists.username)) {
            throw new CustomError('Não é possível registrar este nome de usuário!', BadRequest.STATUS)
        }

        if (exists) throw new CustomError('O nome de usuário já está registrado!', BadRequest.STATUS)

        return
    }
}