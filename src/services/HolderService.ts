import { IHolder } from "../interfaces/IHolder";
import HolderRepository from "../repositories/HolderRepository";
import { UserAttributes, User, Contact, Document, Location } from "../classes/UserSchema";
import CustomError from "../classes/CustomError";
import { IHolderRequest } from "../interfaces/IHolder";
import UserDataSanitizer from "../helpers/UserDataSanitizer";

export default class HolderService {
    holderRepository: HolderRepository;

    constructor() {
        this.holderRepository = new HolderRepository();
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)

        const userData = new UserAttributes({ user, document, contact, location });
        userData.addHolder(body)

        const rawData = await this.holderRepository.Create(userData);
        let sanitizedData = UserDataSanitizer.sanitizeModel(rawData)
        console.log(sanitizedData)
        return sanitizedData
    }

    async ReadAll(query: any) {
        return this.holderRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        const { holder, user } = await this.holderRepository.ReadOne(holder_id);

        UserDataSanitizer.sanitizeObjectKeys(user)
        const sanitizedQuery = UserDataSanitizer.sanitizeQuery({ ...holder, ...user })

        return sanitizedQuery
    }

    async Update(holder_id: string, query: IHolder) {
        return this.holderRepository.Update(holder_id, query);
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }

}