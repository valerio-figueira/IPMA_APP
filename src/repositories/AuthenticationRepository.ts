import Database from "../db/Database";
import Queries from "../db/Queries";
import IAuthentication from "../interfaces/IAuthentication";


export default class AuthenticationRepository {
    private models
    private db: Database

    constructor(db: Database) {
        this.db = db
        this.models = {
            AccessHierarchy: this.db.models.AccessHierarchy,
            User: this.db.models.User,
            Authentication: this.db.models.Authentication,
        }
    }




    async Create(query: IAuthentication) {
        const auth = await this.models.Authentication.create(query, { raw: true })

        return this.ReadOne(auth.authentication_id)
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



    async findByUsername(username: string) {
        return this.models.Authentication.findOne({
            where: { username },
            attributes: { exclude: ['password'] },
            raw: true
        })
    }

}