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

    async ReadAll() {
        return this.holderRepository.ReadAll()
    }

    async ReadOne(holder_id: string) {
        const rawData = await this.holderRepository.ReadOne(holder_id);

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

        if (!userData.holder.id_titular) throw new CustomError('Falha ao processar identificação do titular', 400)

        if (!userData.user.id_usuario) throw new CustomError('Falha ao processar a identificação de usuário', 400)

        const rawData = await this.holderRepository.Update(userData)

        return UserDataSanitizer.sanitizeQuery(rawData)
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }

}