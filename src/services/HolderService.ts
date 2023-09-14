import { IHolder } from "../interfaces/IHolder";
import HolderRepository from "../repositories/HolderRepository";
import { UserAttributes, User, Contact, Document, Location } from "../classes/UserSchema";
import CustomError from "../classes/CustomError";

export default class HolderService {
    holderRepository: HolderRepository;

    constructor() {
        this.holderRepository = new HolderRepository();
    }

    async Create(body: any) {
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)

        const userData = new UserAttributes({ user, document, contact, location });
        userData.addHolder(body)

        console.log(userData)

        return this.holderRepository.Create(userData);
    }

    async ReadAll(query: any) {
        return this.holderRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        return await this.holderRepository.ReadOne(holder_id);
    }

    async Update(holder_id: string, query: IHolder) {
        return this.holderRepository.Update(holder_id, query);
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }


}