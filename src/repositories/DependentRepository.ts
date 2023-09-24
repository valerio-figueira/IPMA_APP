import { Transaction } from "sequelize";
import Database from "../db/Database";
import { IUserAttributes } from "../interfaces/IUser";
import DependentModel from "../models/DependentModel";
import CustomError from "../utils/CustomError";
import UserRepository from "./UserRepository";

export default class DependentRepository {
    db: Database;
    userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.db = new Database();
    }

    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const { user, document, contact, location } = await this.userRepository.Create(query, t);

            const dependent = await DependentModel.create(query.dependent, { transaction: t, raw: true })

            await t.commit();
            return { user, document, contact, location, dependent };
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao cadastrar dependente: ${error}`, 500)
        }
    }

    async ReadAll(holder: string) { }

    async ReadOne(holder: string, dependent: string) { }

    async Update() { }

    async Delete() { }

}