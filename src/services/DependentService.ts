import ContractRegistry from "../classes/ContractRegistrySchema";
import { Contact, Document, Location, User, UserAttributes } from "../classes/UserSchema";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import { IHolder } from "../interfaces/IHolder";
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
            const idTitular = dependent.id_titular

            if(!holderData[idTitular]) {
                const holderFinded: any = await this.holderRepository.ReadOne(idTitular)
                holderFinded['dependents'] = {}
                holderData[idTitular] = holderFinded
            }

            const dependentName = dependent['user']['nome']
            holderData[idTitular]['dependents'][dependentName] = { ...dependent }
        }

        return Object.values(holderData)
    }

    async ReadOne(holder: string | number, id_dependente: string | number) {
        return this.dependentRepository.ReadOne(holder, id_dependente);
    }

    async Update() { }

    async Delete() { }

}