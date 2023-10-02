import AccessHierarchyModel from "../models/AccessHierarchyModel";
import IAccessHierarchy from "../interfaces/IAccessHierarchy";

export default class AccessHierarchyRepository {

    constructor() { }

    async Create(query: IAccessHierarchy) {
        return AccessHierarchyModel.create(query, { raw: true })
    }

    async ReadAll() {
        return AccessHierarchyModel.findAll({ raw: true })
    }

    async ReadOne(hierarchy_id: string | number) {
        return AccessHierarchyModel.findOne({
            where: { hierarchy_id }
        })
    }

    async Update(query: IAccessHierarchy) {
        return AccessHierarchyModel.update(query, {
            where: { hierarchy_id: query.hierarchy_id }
        })
    }

    async Delete(hierarchy_id: string | number) {
        return AccessHierarchyModel.destroy({
            where: { hierarchy_id }
        })
    }

}