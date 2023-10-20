import Database from "../db/Database";
import Queries from "../db/Queries";
import IAuthentication from "../interfaces/IAuthentication";
import AuthenticationModel from "../models/AuthenticationModel";
import UserModel from "../models/user/UserModel";


export default class AuthenticationRepository {
    private models

    constructor(db: Database) {
        this.models = {
            Authentication: AuthenticationModel.INIT(db.sequelize),
            User: UserModel.INIT(db.sequelize)
        }
    }




    async Create(query: IAuthentication) {
        return this.models.Authentication.create(query, { raw: true })
    }




    async ReadAll(query: any) {
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

}