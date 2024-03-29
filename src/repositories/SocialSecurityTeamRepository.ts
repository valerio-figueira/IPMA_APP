import { Sequelize } from "sequelize"
import Database from "../db/Database"
import { SST_Props } from "../interfaces/ISocialSecurityTeam"
import { ID } from "../types/ID"
import CustomError from "../utils/CustomError"
import UserRepository from "./UserRepository"
import SSTBundleEntities from "../entities/SSTBundleEntities"



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
            SocialSecurityTeam: this.db.models.SocialSecurityTeam,
            AccessHierarchy: this.db.models.AccessHierarchy,
            Authentication: this.db.models.Authentication
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
        const whereClause: any = {}

        if (query.user_id) whereClause.user_id = query.user_id

        return this.models.SocialSecurityTeam.findAll({
            where: whereClause,
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Authentication, as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: this.db.models.AccessHierarchy,
                        as: 'hierarchy'
                    }]
                }, {
                    model: this.db.models.Contact, as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: this.db.models.Document, as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] },
                },
                {
                    model: this.db.models.Location, as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }]
            }],
            raw: true, nest: true
        })
    }




    async ReadOne(query: ID) {
        return this.models.SocialSecurityTeam.findByPk(query, {
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Authentication, as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: this.db.models.AccessHierarchy,
                        as: 'hierarchy'
                    }]
                }, {
                    model: this.db.models.Contact, as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: this.db.models.Document, as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] },
                },
                {
                    model: this.db.models.Location, as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }]
            }],
            raw: true, nest: true
        })
    }




    async ReadOneSummary(query: ID) {
        return this.models.SocialSecurityTeam.findByPk(query, {
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Authentication,
                    as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: this.db.models.AccessHierarchy,
                        as: 'hierarchy'
                    }]
                }]
            }], raw: true, nest: true
        })
    }




    async Update(query: SSTBundleEntities) {
        const t = await this.db.sequelize.transaction()

        try {
            const userAffectedCount = await this.userRepository
                .UpdateWithTransaction(query.user.user_id!, query, t)

            const [affectedCount] = await this.models.SocialSecurityTeam.update(query.sstEntity, {
                where: {
                    sst_member_id: query.sstEntity.sst_member_id
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




    async findMemberMyUserId(user_id: ID) {
        return this.models.SocialSecurityTeam
            .findOne({
                where: { user_id }
            })
    }
}

export default SocialSecurityTeamRepository