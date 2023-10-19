import 'jest'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import AccessHierarchyModel from '../../models/AccessHierarchyModel'
import Database from '../../db/Database'


const accessHierarchyService = new AccessHierarchyService()

describe('TEST for Access Hierarchy Service', () => {

    it('should create Root Access in Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'root',
            parent_level_id: null
        }

        const response = await accessHierarchyService.Create(newAccessHierarchy)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response.level_name).toBe('root')
    })

    it('should create nested Adm Access in Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'Administrator',
            parent_level_id: 1
        }

        const response = await accessHierarchyService.Create(newAccessHierarchy)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response.level_name).toBe('Administrator')
    })

    it('should create nested Employee Access in Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'Employee',
            parent_level_id: 2
        }

        const response = await accessHierarchyService.Create(newAccessHierarchy)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response.level_name).toBe('Employee')
        expect(response.hierarchy_id).toBe(3)
    })

    it('should create nested Commum User Access in Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'Common_User',
            parent_level_id: 3
        }

        const response = await accessHierarchyService.Create(newAccessHierarchy)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response.level_name).toBe('Common_User')
        expect(response.hierarchy_id).toBe(4)
    })

    it('should find all hierarchy levels', async () => {
        expect(await accessHierarchyService.ReadAll())
            .toBeInstanceOf(Array)
    })

    it('should find one hierarchy level', async () => {
        const response = await accessHierarchyService.ReadOne(1)
        expect(response).toBeInstanceOf(AccessHierarchyModel)

        expect(response?.level_name).toBe('root')
    })

    it('should update one hierarchy level', async () => {
        const mock = {
            hierarchy_id: 1,
            level_name: 'Root',
            parent_level_id: null
        }

        const response = await accessHierarchyService.Update(mock)

        expect(response).toBeInstanceOf(AccessHierarchyModel)
        expect(response?.level_name).toBe('Root')
    })

    it('should delete one hierarchy level', async () => {
        const response = await accessHierarchyService.Delete(4)

        expect(response?.message).toBe('O nível hierárquico foi removido')
    })
})