import Database from "../db/Database";
import Queries from "../db/Queries";
import IAuthentication from "../interfaces/IAuthentication";
import AuthenticationModel from "../models/AuthenticationModel";


export default class AuthenticationRepository {
    private model

    constructor() {
        this.model = AuthenticationModel
    }

    async Create(query: IAuthentication) {
        return this.model.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        return this.model.findAll({
            include: Queries.IncludeHierarchyAndUser,
            raw: true, nest: true
        })
    }

    async ReadOne(authentication_id: string | number) {
        return this.model.findOne({
            where: { authentication_id },
            attributes: { exclude: ['password'] },
            include: Queries.IncludeHierarchyAndUser,
            raw: true, nest: true
        })
    }

    async Update(query: IAuthentication) {
        return this.model.update(query, {
            where: { authentication_id: query.authentication_id }
        })
    }

    async Delete(authentication_id: string | number) {
        return this.model.destroy({
            where: { authentication_id }
        })
    }

}