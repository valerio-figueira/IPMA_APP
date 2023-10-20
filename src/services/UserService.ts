import UserRepository from "../repositories/UserRepository";
import CustomError from "../utils/CustomError";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import ContactEntity from "../entities/ContactEntity";
import LocationEntity from "../entities/LocationEntity";
import UserAttributes from "../entities/UserAttributes";
import Database from "../db/Database";

export default class UserService {
    userRepository: UserRepository;

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
        const user = new UserEntity(body)
        const document = new DocumentEntity(body)
        const contact = new ContactEntity(body)
        const location = new LocationEntity(body)
        const userData = new UserAttributes({ user, document, contact, location });

        try {
            return this.userRepository.Update(user.user_id!, userData)
        } catch (error: any) {
            throw new CustomError('Não foi possível registrar o usuário', 400)
        }
    }




    async Delete(user_id: string | number) {
        return this.userRepository.Delete(user_id)
    }

}