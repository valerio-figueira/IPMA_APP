import { Transaction } from "sequelize";
import Database from "../db/Database";
import { IUserAttributes } from "../interfaces/IUser";
import CustomError from "../utils/CustomError";
import UserRepository from "./UserRepository";
import Queries from "../db/Queries";
import DependentModel from "../models/DependentModel";
import DependentBundleEntities from "../entities/DependentBundleEntities";
import { ID } from "../types/ID";


export default class DependentRepository {
    private db: Database;
    private userRepository: UserRepository;
    private model

    constructor(db: Database) {
        this.db = db
        this.userRepository = new UserRepository(this.db);
        this.model = DependentModel.INIT(db.sequelize)
    }




    async Create(query: DependentBundleEntities) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await this.userRepository.CreateWithTransaction(query, t);
            const dependent = await this.model.create(query.dependent, { transaction: t, raw: true })

            await t.commit();

            return this.findByDependentId(dependent.dependent_id)
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao cadastrar dependente: ${error}`, 500)
        }
    }




    async ReadAll(holder: string) {
        return this.model.findAll({
            where: { holder_id: holder },
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }




    async ReadOne(holder_id: ID, dependent_id: ID) {
        return this.model.findOne({
            where: { holder_id, dependent_id },
            attributes: { exclude: ['user_id'] },
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }



    async findByDependentId(dependent_id: ID) {
        return this.model.findByPk(dependent_id, {
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }




    async ReadOneSummary(holder: ID, dependent_id: ID) {
        return this.model.findOne({
            where: { holder_id: holder, dependent_id },
            attributes: { exclude: ['user_id'] },
            include: Queries.IncludeDependentSummary,
            raw: true, nest: true
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