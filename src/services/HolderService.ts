import { IHolder } from "../interfaces/IHolder";
import HolderRepository from "../repositories/HolderRepository";
import { UserAttributes, User, Contact, Document, Location } from "../classes/UserSchema";
import CustomError from "../utils/CustomError";
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

        return sanitizedData
    }

    async ReadAll() {
        const holders = await this.holderRepository.ReadAll()

        if(holders.length === 0) throw new CustomError('Nenhum titular foi encontrado', 400)

        return holders
    }

    async ReadOne(holder_id: string | number) {
        const rawData = await this.holderRepository.ReadOne(holder_id);

        if(!rawData) throw new CustomError('Nenhum registro encontrado!', 400)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)

        const userData = new UserAttributes({ user, document, contact, location });
        userData.addHolder(body)

        if (!userData.holder) throw new CustomError('Falha ao processar os dados do titular', 400)

        const rawData = await this.holderRepository.Update(userData)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }

}