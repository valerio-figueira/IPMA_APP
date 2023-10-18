import Database from "../db/Database"
import { SST_Props } from "../interfaces/ISocialSecurityTeam"
import SSTModel from "../models/SocialSecurityTeamModel"
import CustomError from "../utils/CustomError"
import UserRepository from "./UserRepository"


class SocialSecurityTeamRepository {
    private db: Database
    private userRepository: UserRepository
    private model

    constructor() {
        this.db = new Database()
        this.userRepository = new UserRepository()
        this.model = SSTModel
    }

    async Create(body: SST_Props) {
        const t = await this.db.sequelize.transaction()

        try {
            await this.userRepository
                .CreateWithTransaction(body, t)

            await this.model.create(body.sstEntity)

            await t.commit()
        } catch (error) {
            await t.rollback()
            throw new CustomError('Houve um erro ao registrar o cadastro', 500)
        }
    }

    ReadAll(query: any) { }

    ReadOne(query: any) { }

    Update(query: any) { }

    Delete(query: any) { }
}

export default SocialSecurityTeamRepository