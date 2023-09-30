import IAuthentication from "../interfaces/IAuthentication";
import AuthenticationModel from "../models/AuthenticationModel";


export default class AuthenticationRepository {

    constructor() { }

    async Create(query: IAuthentication) {
        return AuthenticationModel.create(query, { raw: true })
    }

    async ReadAll(query: any) {
        return AuthenticationModel.findAll({ raw: true })
    }

    async ReadOne(auth_id: string | number) {
        return AuthenticationModel.findOne({
            where: { id_autenticacao: auth_id },
            raw: true
        })
    }

    async Update(query: IAuthentication) {
        return AuthenticationModel.update(query, {
            where: { id_autenticacao: query.id_autenticacao }
        })
    }

    async Delete(auth_id: string | number) {
        return AuthenticationModel.destroy({
            where: { id_autenticacao: auth_id }
        })
    }

}