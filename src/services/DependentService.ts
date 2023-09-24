import { Contact, Document, Location, User, UserAttributes } from "../classes/UserSchema";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import { IHolder } from "../interfaces/IHolder";
import DependentRepository from "../repositories/DependentRepository";


export default class DependentService {
    dependentRepository: DependentRepository;

    constructor() {
        this.dependentRepository = new DependentRepository();
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)

        const userData = new UserAttributes({ user, document, contact, location });
        userData.addDependent(body)

        const rawData = await this.dependentRepository.Create(userData)
        let sanitizedData = UserDataSanitizer.sanitizeModel(rawData)

        return sanitizedData
    }

    async ReadAll(holder: string) {
        return this.dependentRepository.ReadAll(holder);
    }

    async ReadOne(holder: string, dependent: string) {
        return this.dependentRepository.ReadOne(holder, dependent);
    }

    async Update() { }

    async Delete() { }

}