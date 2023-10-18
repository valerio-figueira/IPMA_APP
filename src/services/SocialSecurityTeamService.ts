import SSTRepository from "../repositories/SocialSecurityTeamRepository"
import SSTEntity from "../entities/SocialSecurityTeamEntity"
import UserEntity from "../entities/UserEntity"
import DocumentEntity from "../entities/DocumentEntity"
import ContactEntity from "../entities/ContactEntity"
import LocationEntity from "../entities/LocationEntity"
import { SST_Props } from "../interfaces/ISocialSecurityTeam"
import SSTBundleEntities from "../entities/SSTBundleEntities"
import AuthenticationEntity from "../entities/AuthenticationEntity"


class SocialSecurityTeamService {
    private sstRepository: SSTRepository

    constructor() {
        this.sstRepository = new SSTRepository()
    }

    Create(body: SST_Props) {
        const sstData = this.bundleEntities(body)

        return this.sstRepository.Create(sstData)
    }

    ReadAll(query: string) { }

    ReadOne(query: string | number) { }

    Update(query: any) { }

    Delete(query: string | number) { }


    private bundleEntities(body: any) {
        return new SSTBundleEntities({
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            sstEntity: new SSTEntity(body),
            authentication: new AuthenticationEntity(body)
        })
    }
}

export default SocialSecurityTeamService