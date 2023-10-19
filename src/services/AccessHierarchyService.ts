import AccessHierarchyRepository from "../repositories/AccessHierarchyRepository";
import IAccessHierarchy from "../interfaces/IAccessHierarchy";
import AccessHierarchyTree from "../helpers/AccessHierarchyTree";
import CustomError from "../utils/CustomError";

export default class AccessHierarchyService {
    accessHierarchyRepository: AccessHierarchyRepository;

    constructor() {
        this.accessHierarchyRepository = new AccessHierarchyRepository();
    }

    async Create(body: IAccessHierarchy) {
        const hierarchyFound = await this.accessHierarchyRepository
            .Exists(body)

        if (hierarchyFound) throw new CustomError('Já está registrado no sistema', 400)

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
        if (!body.hierarchy_id) throw new CustomError('É preciso ter a identificação', 400)

        const [affectedCount] = await this.accessHierarchyRepository.Update(body)

        if (!affectedCount) throw new CustomError('Não houve alterações', 400)

        return this.accessHierarchyRepository
            .ReadOne(body.hierarchy_id)
    }

    async Delete(hierarchy_id: string | number) {
        const affectedCount = await this.accessHierarchyRepository
            .Delete(hierarchy_id)

        if (!affectedCount) throw new CustomError('Não houve alterações', 400)
        if (affectedCount === 1) return { message: `O nível hierárquico foi removido` }
        if (affectedCount > 1) return { message: `Mais de um nível foi removido` }
    }

}