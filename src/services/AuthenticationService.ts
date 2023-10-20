import AuthenticationRepository from "../repositories/AuthenticationRepository";
import CustomError from "../utils/CustomError";
import AuthenticationEntity from "../entities/AuthenticationEntity";
import UserService from "./UserService";
import IAuthentication from "../interfaces/IAuthentication";
import Database from "../db/Database";
import { BadRequest } from "../utils/messages/APIResponse";
import AccessHierarchyService from "./AccessHierarchyService";
import { validate } from "../utils/decorators/validateBody";


export default class AuthenticationService {
    authenticationRepository: AuthenticationRepository;
    accessHierarchyService: AccessHierarchyService;
    userService: UserService;


    constructor(db: Database) {
        this.authenticationRepository = new AuthenticationRepository(db)
        this.accessHierarchyService = new AccessHierarchyService(db)
        this.userService = new UserService(db)
    }


    @validate
    async Create(body: AuthenticationEntity) {
        const authEntity = new AuthenticationEntity(body)

        if (!authEntity.user_id || !authEntity.hierarchy_id)
            throw new CustomError(BadRequest.MESSAGE, BadRequest.STATUS)

        // THE USER IS HOLDER, DEPENDENT OR MEMBER OF ORGANIZATION?


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

}