import Database from "../db/Database"
import Queries from "../db/Queries"
import { SST_Props } from "../interfaces/ISocialSecurityTeam"
import AccessHierarchyModel from "../models/AccessHierarchyModel"
import AuthenticationModel from "../models/AuthenticationModel"
import SSTModel from "../models/SocialSecurityTeamModel"
import ContactModel from "../models/user/ContactModel"
import DocumentModel from "../models/user/DocumentModel"
import LocationModel from "../models/user/LocationModel"
import UserModel from "../models/user/UserModel"
import { ID } from "../types/ID"
import CustomError from "../utils/CustomError"
import UserRepository from "./UserRepository"


class SocialSecurityTeamRepository {
    private db
    private seq
    private userRepository: UserRepository
    private models

    constructor() {
        this.db = new Database()
        this.seq = this.db.sequelize
        this.userRepository = new UserRepository()
        this.models = {
            SocialSecurityTeam: SSTModel.INIT(this.seq),
            User: UserModel.INIT(this.seq),
            Document: DocumentModel.INIT(this.seq),
            Contact: ContactModel.INIT(this.seq),
            Location: LocationModel.INIT(this.seq),
            AccessHierarchy: AccessHierarchyModel.INIT(this.seq),
            Authentication: AuthenticationModel.INIT(this.seq)
        }
    }

    async Create(body: SST_Props) {
        const t = await this.db.sequelize.transaction()

        try {
            await this.userRepository
                .CreateWithTransaction(body, t)

            const sstMember = await this.models.SocialSecurityTeam
                .create(body.sstEntity, { transaction: t, raw: true })

            await t.commit()
            return this.ReadOne(sstMember.sst_member_id)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error, 500)
        }
    }

    async ReadAll(query: any) {
        return this.models.SocialSecurityTeam.findAll({
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async ReadOne(query: ID) {
        return this.models.SocialSecurityTeam.findByPk(query, {
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async ReadOneSummary(query: ID) {
        return this.models.SocialSecurityTeam.findByPk(query, {
            include: Queries.IncludeUserDataSummary,
            raw: true, nest: true
        })
    }

    async Update(query: any) {
        return this.models.SocialSecurityTeam.update(query, {
            where: {
                sst_member_id: query.sst_member_id
            }
        })
    }

    async Delete(query: any) { }
}

export default SocialSecurityTeamRepository