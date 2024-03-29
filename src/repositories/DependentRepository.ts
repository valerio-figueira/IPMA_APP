import { Transaction } from "sequelize";
import Database from "../db/Database";
import CustomError from "../utils/CustomError";
import UserRepository from "./UserRepository";
import DependentBundleEntities from "../entities/DependentBundleEntities";
import { ID } from "../types/ID";



export default class DependentRepository {
    private db: Database;
    private userRepository: UserRepository;
    private model



    constructor(db: Database) {
        this.db = db
        this.userRepository = new UserRepository(this.db);
        this.model = this.db.models.Dependent
    }






    async Create(query: DependentBundleEntities, t: Transaction) {
        await this.userRepository.CreateWithTransaction(query, t);
        return this.model.create(query.dependent, { transaction: t, raw: true })
    }






    async ReadAll(holder_id: string | number) {
        return this.model.findAll({
            where: { holder_id },
            include: [{
                model: this.db.models.User,
                as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
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






    async ReadOne(holder_id: ID, dependent_id: ID) {
        return this.model.findOne({
            where: { holder_id, dependent_id },
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Contact, as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: this.db.models.Document, as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] }
                },
                {
                    model: this.db.models.Location, as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }]
            }, {
                model: this.db.models.Member, as: 'subscription',
                include: [{ model: this.db.models.Agreement, as: 'agreement' }]
            }], raw: true, nest: true
        })
    }






    async findByDependentId(dependent_id: ID) {
        return this.model.findByPk(dependent_id, {
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] },
                include: [{
                    model: this.db.models.Contact, as: 'contact',
                    attributes: { exclude: ['user_id', 'contact_id'] }
                },
                {
                    model: this.db.models.Document, as: 'document',
                    attributes: { exclude: ['user_id', 'document_id'] }
                },
                {
                    model: this.db.models.Location, as: 'location',
                    attributes: { exclude: ['user_id', 'location_id'] }
                }]
            }, {
                model: this.db.models.Member, as: 'subscription',
                include: [{ model: this.db.models.Agreement, as: 'agreement' }]
            }],
            raw: true, nest: true
        })
    }






    async ReadOneSummary(holder: ID, dependent_id: ID) {
        return this.model.findOne({
            where: { holder_id: holder, dependent_id },
            attributes: { exclude: ['user_id'] },
            include: [{
                model: this.db.models.User, as: 'user',
                attributes: { exclude: ['user_id'] }
            }], raw: true, nest: true
        })
    }






    async Update(query: DependentBundleEntities) {
        const t: Transaction = await this.db.sequelize.transaction()
        const dependent_id = query.dependent.dependent_id!
        const user_id = query.user.user_id!

        try {
            const userData = await this.userRepository
                .UpdateWithTransaction(user_id, query, t)

            const [dependent] = await this.model
                .update(query.dependent, {
                    where: { dependent_id }, transaction: t
                })

            await t.commit()

            return [userData, dependent]
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(`Erro ao atualizar dependente: ${error}`, 500)
        }
    }




    async Delete() { }

}