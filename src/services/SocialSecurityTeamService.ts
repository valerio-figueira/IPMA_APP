import SSTRepository from "../repositories/SocialSecurityTeamRepository"
import SSTEntity from "../entities/SocialSecurityTeamEntity"
import UserEntity from "../entities/UserEntity"
import DocumentEntity from "../entities/DocumentEntity"
import ContactEntity from "../entities/ContactEntity"
import LocationEntity from "../entities/LocationEntity"
import SSTBundleEntities from "../entities/SSTBundleEntities"
import UserDataSanitizer from "../helpers/UserDataSanitizer"
import CustomError from "../utils/CustomError"
import Database from "../db/Database"
import { validateUser } from "../utils/decorators/validateBody"
import UserService from "./UserService"
import SSTErrors from "../utils/errors/SocialSecurityErrors"



class SocialSecurityTeamService {
    private sstRepository: SSTRepository
    private userService: UserService

    constructor(db: Database) {
        this.sstRepository = new SSTRepository(db)
        this.userService = new UserService(db)
    }



    @validateUser('SSTeam')
    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const sstData = this.bundleEntities(body)
        await this.userService.Exists(sstData.document)

        return this.sstRepository.Create(sstData)
    }




    async ReadAll(query: any) {
        return this.sstRepository.ReadAll(query)
    }




    async ReadOne(query: string | number) {
        return this.sstRepository.ReadOne(query)
    }



    @validateUser('SSTeam')
    async Update(query: any) {
        UserDataSanitizer.sanitizeBody(query)
        const memberFound = await this.ReadOne(query.sst_member_id)

        if (!memberFound) throw new CustomError(SSTErrors.NotFound, 400)
        query.user_id = memberFound.user_id

        const sstData = this.bundleEntities(query)

        const [userAffectedCount, affectedCount] = await this.sstRepository.Update(sstData)

        if (!affectedCount && !userAffectedCount) throw new CustomError(SSTErrors.NotAffected, 400)

        return { message: SSTErrors.UpdatedSuccessfully }
    }




    async Delete(query: string | number) {
        const member = await this.ReadOne(query)

        if (!member) throw new CustomError(SSTErrors.NotFound, 400)

        return this.sstRepository.Delete(member.user_id)
    }



    async findMemberByUserId(user_id: string | number) {
        return this.sstRepository.findMemberMyUserId(user_id)
    }



    private bundleEntities(body: any) {
        return new SSTBundleEntities({
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            sstEntity: new SSTEntity(body)
        })
    }
}

export default SocialSecurityTeamService