import Queries from "../db/Queries";
import IAuthentication from "../interfaces/IAuthentication";
import AuthenticationModel from "../models/AuthenticationModel";


export default class AuthenticationRepository {

    constructor() { }

    async Create(query: IAuthentication) {
        return AuthenticationModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        return AuthenticationModel.findAll({
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async ReadOne(authentication_id: string | number) {
        return AuthenticationModel.findOne({
            where: { authentication_id },
            include: Queries.IncludeUserData,
            raw: true, nest: true
        })
    }

    async Update(query: IAuthentication) {
        return AuthenticationModel.update(query, {
            where: { authentication_id: query.authentication_id }
        })
    }

    async Delete(authentication_id: string | number) {
        return AuthenticationModel.destroy({
            where: { authentication_id }
        })
    }

}