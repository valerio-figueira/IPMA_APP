import 'jest'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import AccessHierarchyModel from '../../models/AccessHierarchyModel'
import Database from '../../db/Database'


const accessHierarchyService = new AccessHierarchyService()

describe('TEST for Access Hierarchy Service', () => {
    beforeAll(async () => {
        const db = new Database()
        await db.syncModels()
        await db.clearDatabase()
    })

    it('should create new Access Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'Root',
            parent_level_id: null
        }

        expect(await accessHierarchyService.Create(newAccessHierarchy))
            .toBeInstanceOf(AccessHierarchyModel)
    })

    it('should find all hierarchy levels', async () => {
        expect(await accessHierarchyService.ReadAll())
            .toBeInstanceOf(Array)
    })

    it('should find one hierarchy level', async () => {
        const response = await accessHierarchyService.ReadOne(1)
        expect(response).toBeInstanceOf(AccessHierarchyModel)

        expect(response?.level_name).toBe('Root')
    })

    it('should update one hierarchy level', async () => {
        const mock = {
            hierarchy_id: 1,
            level_name: 'root',
            parent_level_id: null
        }

        const response = await accessHierarchyService.Update(mock)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response?.level_name).toBe('root')
    })

    it('should delete one hierarchy level', async () => {
        const response = await accessHierarchyService.Delete('1')

        expect(response).toBe(1)
    })
})