import 'jest'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import AccessHierarchyModel from '../../models/AccessHierarchyModel'
import Database from '../../db/Database'


const db = new Database()

const accessHierarchyService = new AccessHierarchyService()

describe('TEST for Access Hierarchy Service', () => {
    afterEach(async () => await db.clearDatabase())

    it('should create new Access Hierarchy', async () => {
        const newAccessHierarchy = {
            level_name: 'Root',
            parent_level_id: null
        }

        expect(await accessHierarchyService.Create(newAccessHierarchy))
        .toBeInstanceOf(AccessHierarchyModel)
    })
})