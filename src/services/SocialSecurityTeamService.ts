import SSTRepository from "../repositories/SocialSecurityTeamRepository"
import SSTEntity from "../entities/SocialSecurityTeamEntity"
import UserEntity from "../entities/UserEntity"
import DocumentEntity from "../entities/DocumentEntity"
import ContactEntity from "../entities/ContactEntity"
import LocationEntity from "../entities/LocationEntity"
import SSTBundleEntities from "../entities/SSTBundleEntities"
import AuthenticationEntity from "../entities/AuthenticationEntity"
import UserDataSanitizer from "../helpers/UserDataSanitizer"
import CustomError from "../utils/CustomError"


class SocialSecurityTeamService {
    private sstRepository: SSTRepository

    constructor() {
        this.sstRepository = new SSTRepository()
    }

    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const sstData = this.bundleEntities(body)

        return this.sstRepository.Create(sstData)
    }

    async ReadAll(query: string) {
        return this.sstRepository.ReadAll(query)
    }

    async ReadOne(query: string | number) {
        return this.sstRepository.ReadOne(query)
    }

    async Update(query: any) {
        const [affectedCount] = await this.sstRepository.Update(query)

        if (!affectedCount) throw new CustomError('Não houve alterações', 400)
        if (affectedCount === 1) return { message: 'Atualizado com sucesso' }
        if (affectedCount > 1) return { message: 'Houve mais de uma alteração' }
    }

    async Delete(query: string | number) {
        return this.sstRepository.Delete(query)
    }


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