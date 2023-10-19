import AccessHierarchyModel from "../models/AccessHierarchyModel";
import IAccessHierarchy from "../interfaces/IAccessHierarchy";
import Database from "../db/Database";

export default class AccessHierarchyRepository {
    private db: Database
    private model

    constructor() {
        this.db = new Database()
        this.model = AccessHierarchyModel.INIT(this.db.sequelize)
    }

    async Create(query: IAccessHierarchy) {
        return this.model.create(query, { raw: true })
    }

    async ReadAll() {
        return this.model.findAll({ raw: true })
    }

    async ReadOne(hierarchy_id: string | number) {
        return this.model.findOne({
            where: { hierarchy_id }
        })
    }

    async Update(query: IAccessHierarchy) {
        return this.model.update(query, {
            where: { hierarchy_id: query.hierarchy_id }
        })
    }

    async Delete(hierarchy_id: string | number) {
        return this.model.destroy({
            where: { hierarchy_id }
        })
    }

    async Exists(query: IAccessHierarchy) {
        const whereClause: any = { level_name: query.level_name }

        if (query.hierarchy_id) whereClause.hierarchy_id = query.hierarchy_id

        return this.model.findOne({ where: whereClause })
    }

}