import { IUserAttributes } from "../interfaces/IUser";
import UserRepository from "./UserRepository";
import HolderModel from "../models/HolderModel";
import Database from "../db/Database";
import CustomError from '../utils/CustomError';
import { Transaction } from 'sequelize';
import UserModel from "../models/user/UserModel";
import Queries from "../db/Queries";
import MemberModel from "../models/MemberModel";
import DependentModel from "../models/DependentModel";
import DocumentModel from "../models/user/DocumentModel";
import ContactModel from "../models/user/ContactModel";
import LocationModel from "../models/user/LocationModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";

export default class HolderRepository {
    private db: Database;
    private userRepository: UserRepository;
    private models
    private seq

    constructor() {
        this.userRepository = new UserRepository();
        this.db = new Database();
        this.seq = this.db.sequelize
        this.models = {
            Holder: HolderModel.INIT(this.seq),
            User: UserModel.INIT(this.seq),
            Document: DocumentModel.INIT(this.seq),
            Contact: ContactModel.INIT(this.seq),
            Location: LocationModel.INIT(this.seq),
            AccessHierarchy: AccessHierarchyModel.INIT(this.seq),
            Authentication: AuthenticationModel.INIT(this.seq)
        }
    }

    async Create(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            await this.userRepository.CreateWithTransaction(query, t);

            const holder = await this.models.Holder
                .create(query.holder, { transaction: t, raw: true })

            await t.commit();
            return this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Erro ao criar o titular: ${error}`, 500)
        }
    }

    async ReadAll() {
        return this.models.Holder
            .findAll({
                include: Queries.IncludeUserData,
                raw: true, nest: true
            })
    }

    async ReadOne(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: Queries.IncludeUserData,
                raw: true, nest: true
            })
    }

    async ReadOneSummary(holder_id: string | number) {
        return this.models.Holder
            .findByPk(holder_id, {
                include: Queries.IncludeUserDataSummary,
                raw: true, nest: true
            })
    }

    async Update(query: IUserAttributes) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await this.ReadOne(query.holder?.holder_id!)

            if (!holder) throw new CustomError('Usuário não encontrado', 404)

            const userResult = await this.userRepository
                .UpdateWithTransaction(holder.user_id, query, t)

            const [holderResult] = await this.models.Holder
                .update(query.holder!, {
                    where: { user_id: query.user.user_id },
                    transaction: t
                })

            if (!userResult && !holderResult) throw new CustomError(`Nenhum dado foi alterado para ${query.user.name}`, 400)

            await t.commit()

            return this.ReadOne(holder.holder_id)
        } catch (error: any) {
            await t.rollback()
            throw new CustomError(error.message || 'Não foi possível atualizar os dados do usuário', error.status || 500)
        }
    }

    async Delete(holder_id: string) {
        const t: Transaction = await this.db.sequelize.transaction();

        try {
            const holder = await this.ReadOneSummary(holder_id)
            const user_id = holder!['user_id']
            const user = await UserModel.findByPk(user_id, { raw: true })
            const dependents = await DependentModel.findAll({
                where: { holder_id }
            })

            if (dependents.length > 0) {
                for (let dependent of dependents) {
                    await MemberModel.destroy({
                        where: { holder_id },
                        transaction: t,
                    })

                    await DependentModel.destroy({
                        where: { dependent_id: dependent.dependent_id },
                        transaction: t,
                    })
                }
            }

            await this.models.Holder.destroy({
                where: { user_id },
                transaction: t,
            })

            await this.userRepository.DeleteWithTransaction((user_id as number), t)

            await t.commit()

            return { message: `O usuário ${user?.name} foi removido juntamente com todas as suas dependências` }
        } catch (error: any) {
            await t.rollback();
            throw new CustomError(`Falha ao remover titular: ${error.message}`, 500)
        }
    }

    private createNestedObj(data: any[]) {
        return {
            holder: {
                ...data[0].toJSON(),
                user: {
                    ...data[1].toJSON(),
                    document: data[2].toJSON(),
                    contact: data[3].toJSON(),
                    location: data[4].toJSON(),
                }
            }
        }
    }

}