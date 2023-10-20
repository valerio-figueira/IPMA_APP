import { Sequelize } from "sequelize"
import Database from "../db/Database"
import Queries from "../db/Queries"
import { SST_Props } from "../interfaces/ISocialSecurityTeam"
import AccessHierarchyModel from "../models/AccessHierarchyModel"
import AuthenticationModel from "../models/AuthenticationModel"
import SSTModel from "../models/SocialSecurityTeamModel"
import UserModel from "../models/user/UserModel"
import { ID } from "../types/ID"
import CustomError from "../utils/CustomError"
import UserRepository from "./UserRepository"


class SocialSecurityTeamRepository {
    private db: Database
    private seq: Sequelize
    private userRepository: UserRepository
    private models

    constructor(db: Database) {
        this.db = db
        this.seq = this.db.sequelize
        this.userRepository = new UserRepository(this.db)
        this.models = {
            SocialSecurityTeam: SSTModel.INIT(this.seq),
            AccessHierarchy: AccessHierarchyModel.INIT(this.seq),
            Authentication: AuthenticationModel.INIT(this.seq)
        }
    }




    async Create(body: SST_Props) {
        const t = await this.db.sequelize.transaction()

        try {
            await this.userRepository
                .CreateWithTransaction(body, t)

            await this.models.Authentication
                .create(body.authentication, { transaction: t, raw: true })

            const sstMember = await this.models.SocialSecurityTeam
                .create(body.sstEntity, { transaction: t, raw: true })

            await t.commit()
            return this.ReadOne(sstMember.sst_member_id)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error, 500)
        }
    }




    async ReadAll() {
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
        const t = await this.db.sequelize.transaction()

        try {
            const userAffectedCount = await this.userRepository
                .UpdateWithTransaction(query.user_id, query, t)

            const [affectedCount] = await this.models.SocialSecurityTeam.update(query, {
                where: {
                    sst_member_id: query.sst_member_id
                }, transaction: t
            })

            await t.commit()
            return [userAffectedCount, affectedCount]
        } catch (error: any) {
            await t.rollback()
            throw new CustomError('Não foi possível atualizar os dados', 500)
        }
    }




    async Delete(user_id: ID) {
        await this.seq.sync()
        const transaction = await this.db.sequelize.transaction()

        try {
            const affectedCount = await this.userRepository
                .DeleteWithTransaction(user_id, transaction)

            await transaction.commit()
            return affectedCount
        } catch (error: any) {
            await transaction.rollback()
        }
    }
}

export default SocialSecurityTeamRepository