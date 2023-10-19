import UserDataSanitizer from "../helpers/UserDataSanitizer";
import DependentRepository from "../repositories/DependentRepository";
import HolderRepository from "../repositories/HolderRepository";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import LocationEntity from "../entities/LocationEntity";
import ContactEntity from "../entities/ContactEntity";
import DependentBundleEntities from "../entities/DependentBundleEntities";
import DependentEntity from "../entities/DependentEntity";
import MemberEntity from "../entities/MemberEntity";
import Database from "../db/Database";

type ID = number | string

export default class DependentService {
    private dependentRepository: DependentRepository;
    private holderRepository: HolderRepository;

    constructor(db: Database) {
        this.dependentRepository = new DependentRepository(db);
        this.holderRepository = new HolderRepository(db);
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const dependentData = this.bundleEntities(body)

        if (body.username && body.password) {
            dependentData.setAuthentication(body)
        }

        return await this.dependentRepository.Create(dependentData)
    }

    async ReadAll(holder: string) {
        const dependents: any[] = await this.dependentRepository
            .ReadAll(holder);

        const holderData: Record<number, any> = {}

        for (let dependent of dependents) {
            const holderID = dependent.holder_id

            if (!holderData[holderID]) {
                const holderFinded: any = await this.holderRepository
                    .ReadOne(holderID)
                holderFinded['dependents'] = {}
                holderData[holderID] = holderFinded
            }

            const dependentName = dependent['user']['name']
            holderData[holderID]['dependents'][dependentName] = { ...dependent }
        }

        return Object.values(holderData)
    }

    async ReadOne(holder: ID, dependent_id: ID) {
        return this.dependentRepository
            .ReadOne(holder, dependent_id);
    }

    async ReadOneSummary(holder: ID, dependent_id: ID) {
        return this.dependentRepository
            .ReadOneSummary(holder, dependent_id);
    }

    async Update() { }

    async Delete() { }

    private bundleEntities(body: any) {
        return new DependentBundleEntities({
            dependent: new DependentEntity(body),
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            member: new MemberEntity(body)
        })
    }

}