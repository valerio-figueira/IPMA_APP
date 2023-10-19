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

    async ReadAll() {
        return this.sstRepository.ReadAll()
    }

    async ReadOne(query: string | number) {
        return this.sstRepository.ReadOne(query)
    }

    async Update(query: any) {
        const memberFound = await this.ReadOne(query.sst_member_id)

        if (!memberFound) throw new CustomError('O membro não foi localizado', 400)
        query.user_id = memberFound.user_id

        const [userAffectedCount, affectedCount] = await this.sstRepository.Update(query)

        if (!affectedCount && userAffectedCount) throw new CustomError('Não houve alterações', 400)

        return { message: 'Atualizado com sucesso' }
    }

    async Delete(query: string | number) {
        const member = await this.ReadOne(query)

        if (!member) throw new CustomError('Não foi localizado', 400)

        const affectedCount = await this.sstRepository.Delete(member.user_id)

        if (!affectedCount) throw new CustomError('Não houve nenhuma remoção', 400)
        if (affectedCount === 1) return { message: 'Usuário removido do sistema' }
        if (affectedCount > 1) return { message: 'Mais de um usuário foi removido' }
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