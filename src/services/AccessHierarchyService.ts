import AccessHierarchyRepository from "../repositories/AccessHierarchyRepository";
import IAccessHierarchy from "../interfaces/IAccessHierarchy";
import AccessHierarchyTree from "../helpers/AccessHierarchyTree";

export default class AccessHierarchyService {
    accessHierarchyRepository: AccessHierarchyRepository;

    constructor() {
        this.accessHierarchyRepository = new AccessHierarchyRepository();
    }

    async Create(body: IAccessHierarchy) {
        return this.accessHierarchyRepository.Create(body)
    }

    async ReadAll() {
        const hierarchies = await this.accessHierarchyRepository.ReadAll()
        const hierarchyTree = new AccessHierarchyTree(hierarchies)
        
        return hierarchyTree.buildHierarchyTree()
    }

    async ReadOne(hierarchy_id: string | number) {
        return this.accessHierarchyRepository.ReadOne(hierarchy_id)
    }

    async Update(body: IAccessHierarchy) {
        return this.accessHierarchyRepository.Update(body)
    }

    async Delete(hierarchy_id: string | number) {
        return this.accessHierarchyRepository.Delete(hierarchy_id)
    }

}