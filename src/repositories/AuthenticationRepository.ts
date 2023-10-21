import Database from "../db/Database";
import Queries from "../db/Queries";
import IAuthentication from "../interfaces/IAuthentication";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";
import UserModel from "../models/user/UserModel";


export default class AuthenticationRepository {
    private models

    constructor(db: Database) {
        this.models = {
            AccessHierarchy: AccessHierarchyModel.INIT(db.sequelize),
            User: UserModel.INIT(db.sequelize),
            Authentication: AuthenticationModel.INIT(db.sequelize),
        }
    }




    async Create(query: IAuthentication) {
        const auth = await this.models.Authentication.create(query, { raw: true })

        return this.models.Authentication.findByPk(auth.user_id)
    }




    async ReadAll() {
        return this.models.Authentication.findAll({
            include: Queries.IncludeHierarchyAndUser,
            raw: true, nest: true
        })
    }




    async ReadOne(authentication_id: string | number) {
        return this.models.Authentication.findOne({
            where: { authentication_id },
            attributes: { exclude: ['password'] },
            include: Queries.IncludeHierarchyAndUser,
            raw: true, nest: true
        })
    }




    async Update(query: IAuthentication) {
        return this.models.Authentication.update(query, {
            where: { authentication_id: query.authentication_id }
        })
    }




    async Delete(authentication_id: string | number) {
        return this.models.Authentication.destroy({
            where: { authentication_id }
        })
    }



    async findByUserId(user_id: string | number) {
        return this.models.Authentication.findOne({
            where: { user_id },
            attributes: { exclude: ['password'] },
            include: Queries.IncludeHierarchyAndUser,
            raw: true, nest: true
        })
    }

}