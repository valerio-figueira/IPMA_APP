import AuthenticationRepository from "../repositories/AuthenticationRepository";
import CustomError from "../utils/CustomError";
import { AuthenticationSchema } from "../classes/AuthenticationSchema";
import UserService from "./UserService";
import IAuthentication from "../interfaces/IAuthentication";

export default class AutenticationService {
    authenticationRepository: AuthenticationRepository;
    userService: UserService;

    constructor() {
        this.authenticationRepository = new AuthenticationRepository()
        this.userService = new UserService()
    }

    async Create(body: any) {
        const authSchema = new AuthenticationSchema(body)

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
        return this.authenticationRepository.Update(query)
    }

    async Delete(auth_id: string | number) {
        return this.authenticationRepository.Delete(auth_id)
    }

}