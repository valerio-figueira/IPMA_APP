import AccessHierarchyModel from "../models/AccessHierarchyModel";
import IAccessHierarchy from "../interfaces/IAccessHierarchy";

export default class AccessHierarchyRepository {
    private model

    constructor() {
        this.model = AccessHierarchyModel
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

}