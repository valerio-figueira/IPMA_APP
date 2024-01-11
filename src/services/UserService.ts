import UserRepository from "../repositories/UserRepository";
import CustomError from "../utils/CustomError";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import ContactEntity from "../entities/ContactEntity";
import LocationEntity from "../entities/LocationEntity";
import UserAttributes from "../entities/UserAttributes";
import Database from "../db/Database";
import { BadRequest } from "../utils/messages/APIResponse";
import UserDataSanitizer from "../helpers/UserDataSanitizer";




export default class UserService {
    private userRepository: UserRepository;

    constructor(db: Database) {
        this.userRepository = new UserRepository(db);
    }



    async Create(body: any) {
        const user = new UserEntity(body)
        const document = new DocumentEntity(body)
        const contact = new ContactEntity(body)
        const location = new LocationEntity(body)
        const userData = new UserAttributes({ user, document, contact, location });

        try {
            return this.userRepository.Create(userData)
        } catch (error: any) {
            throw new CustomError('Não foi possível registrar o usuário', 400)
        }
    }




    async ReadAll() {
        return this.userRepository.ReadAll()
    }




    async ReadOne(user_id: string | number) {
        return this.userRepository.ReadOne(user_id)
    }




    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const user = new UserEntity(body)
        const document = new DocumentEntity(body)
        const contact = new ContactEntity(body)
        const location = new LocationEntity(body)
        const userData = new UserAttributes({ user, document, contact, location });

        if (!user.user_id) throw new CustomError('Verifique a identificação de usuário', 400)

        try {
            const affectedCount = await this.userRepository.Update(user.user_id, userData)

            if (!affectedCount) throw new CustomError('Não houve alterações', 400)

            return this.ReadOne(user.user_id)
        } catch (error: any) {
            throw new CustomError(error.message, BadRequest.STATUS)
        }
    }




    async Delete(user_id: string | number) {
        return this.userRepository.Delete(user_id)
    }





    async Exists(query: DocumentEntity) {
        const userFound = await this.userRepository.Exists(query)

        if (userFound)
            throw new CustomError('Usuário ou documento já existe na base de dados', 400)
    }




    async throwErrorIfNotExists(user_id: string | number) {
        const userFound = await this.userRepository
            .ExistsById(user_id)

        if (!userFound)
            throw new CustomError('Identificação de usuário inválida', 400)
    }

}