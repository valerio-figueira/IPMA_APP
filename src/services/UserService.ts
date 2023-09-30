import UserRepository from "../repositories/UserRepository";
import CustomError from "../utils/CustomError";
import { Contact, Document, Location, User, UserAttributes } from "../classes/UserSchema";

export default class UserService {
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async Create(body: any) {
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)
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
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)
        const userData = new UserAttributes({ user, document, contact, location });

        try {
            return this.userRepository.Update(user.id_usuario!, userData)
        } catch (error: any) {
            throw new CustomError('Não foi possível registrar o usuário', 400)
        }
    }

    async Delete(user_id: string | number) {
        return this.userRepository.Delete(user_id)
    }

}