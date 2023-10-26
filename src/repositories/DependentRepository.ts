import { Transaction } from "sequelize";
import Database from "../db/Database";
import { IUserAttributes } from "../interfaces/IUser";
import CustomError from "../utils/CustomError";
import UserRepository from "./UserRepository";
import MemberModel from "../models/MemberModel";
import Queries from "../db/Queries";
import DependentModel from "../models/DependentModel";


export default class DependentRepository {
    private db: Database;
    private userRepository: UserRepository;
    private model

    constructor(db: Database) {
        this.db = db
        this.userRepository = new UserRepository(this.db);
        this.model = DependentModel.INIT(db.sequelize)
    }




    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await this.userRepository.CreateWithTransaction(query, t);
            const dependent = await this.model.create(query.dependent, { transaction: t, raw: true })

            query.contract!.dependent_id = dependent.dependent_id

            await MemberModel.create(query.contract, { transaction: t, raw: true })

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
            attributes: { exclude: ['user_id'] },
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }




    async ReadOne(holder: string | number, dependent_id: string | number) {
        return this.model.findOne({
            where: { holder_id: holder, dependent_id },
            attributes: { exclude: ['user_id'] },
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }



    async findByDependentId(dependent_id: string | number) {
        return this.model.findByPk(dependent_id, {
            include: Queries.IncludeDependentUserData,
            raw: true, nest: true
        })
    }




    async ReadOneSummary(holder: string | number, dependent_id: string | number) {
        return this.model.findOne({
            where: { holder_id: holder, dependent_id },
            attributes: { exclude: ['user_id'] },
            include: Queries.IncludeDependentSummary,
            raw: true, nest: true
        })
    }




    async Update() { }




    async Delete() { }





    createNestedObj(data: any[]) {
        return {
            dependent: {
                ...data[0].toJSON(),
                user: {
                    ...data[1].toJSON(),
                    document: data[2].toJSON(),
                    contact: data[3].toJSON(),
                    location: data[4].toJSON(),
                },
                contract: data[5].toJSON()
            }
        }
    }
}