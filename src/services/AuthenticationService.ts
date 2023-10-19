import AuthenticationRepository from "../repositories/AuthenticationRepository";
import CustomError from "../utils/CustomError";
import AuthenticationEntity from "../entities/AuthenticationEntity";
import UserService from "./UserService";
import IAuthentication from "../interfaces/IAuthentication";
import Database from "../db/Database";

export default class AutenticationService {
    authenticationRepository: AuthenticationRepository;
    userService: UserService;

    constructor(db: Database) {
        this.authenticationRepository = new AuthenticationRepository(db)
        this.userService = new UserService()
    }

    async Create(body: any) {
        const authSchema = new AuthenticationEntity(body)

        if (!authSchema.user_id) {
            const { user } = await this.userService.Create(body);
            authSchema.user_id = user.user_id;
        }

        const auth = await this.authenticationRepository.Create(authSchema);

        if (auth) {
            const userName = (await this.userService.ReadOne(authSchema.user_id))?.name;
            if (!userName) {
                throw new CustomError('Usuário não foi encontrado', 400);
            }
            return this.authenticationRepository.ReadOne(auth.authentication_id)
        }
    }

    async ReadAll(query: any) {
        return this.authenticationRepository.ReadAll(query)
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