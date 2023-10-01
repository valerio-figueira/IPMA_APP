import { Contact, Document, Location, User, UserAttributes } from "../classes/UserSchema";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import DependentRepository from "../repositories/DependentRepository";
import HolderRepository from "../repositories/HolderRepository";


export default class DependentService {
    dependentRepository: DependentRepository;
    holderRepository: HolderRepository;

    constructor() {
        this.dependentRepository = new DependentRepository();
        this.holderRepository = new HolderRepository();
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const user = new User(body)
        const document = new Document(body)
        const contact = new Contact(body)
        const location = new Location(body)

        const userData = new UserAttributes({ user, document, contact, location });
        userData.addDependent(body)
        userData.addContract(body)

        return await this.dependentRepository.Create(userData)
    }

    async ReadAll(holder: string) {
        const dependents: any[] = await this.dependentRepository.ReadAll(holder);

        const holderData: Record<number, any> = {}

        for(let dependent of dependents) {
            const holderID = dependent.holder_id

            if(!holderData[holderID]) {
                const holderFinded: any = await this.holderRepository.ReadOne(holderID)
                holderFinded['dependents'] = {}
                holderData[holderID] = holderFinded
            }

            const dependentName = dependent['user']['name']
            holderData[holderID]['dependents'][dependentName] = { ...dependent }
        }

        return Object.values(holderData)
    }

    async ReadOne(holder: string | number, dependent_id: string | number) {
        return this.dependentRepository.ReadOne(holder, dependent_id);
    }

    async Update() { }

    async Delete() { }

}