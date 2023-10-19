import 'jest'
import SocialSecurityTeamService from '../../services/SocialSecurityTeamService'
import { UserMock, SSTUserMock } from '../../utils/mocks/SSTMock'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import Database from '../../db/Database'
import CustomError from '../../utils/CustomError'


const sstService = new SocialSecurityTeamService()
const accessHierarchyService = new AccessHierarchyService()

const resetDB = async () => {
    const db = new Database()
    await db.syncModels()
    await db.clearDatabase()
}

describe('TEST for SST service', () => {
    beforeAll(async () => {
        await resetDB()
        await accessHierarchyService.Create({
            level_name: 'Root',
            parent_level_id: null
        })

        await accessHierarchyService.Create({
            level_name: 'Administrator',
            parent_level_id: 1
        })

        await accessHierarchyService.Create({
            level_name: 'Employee',
            parent_level_id: 2
        })
    })


    it('should create new member for social security team', async () => {

        const response = await sstService.Create(UserMock)
        expect(response).toBeInstanceOf(Object)
    })

    it('should insert another member in social security team', async () => {

        const response = await sstService.Create(SSTUserMock)
        expect(response).toBeInstanceOf(Object)
    })

    it('should GET a member', async () => {

        const response = await sstService.ReadOne(2)
        expect(response).toBeInstanceOf(Object)
    })

    it('should update a member in social security team', async () => {
        SSTUserMock.name = 'Nikos Papadopoulos II'
        SSTUserMock.sst_member_id = 1
        const response = await sstService.Update(SSTUserMock)

        expect(response).toBeInstanceOf(Object)
        expect(response).toHaveProperty('message')
        expect(response?.message).toBe('Atualizado com sucesso')
    })

    it('should not update a member in social security team', async () => {
        SSTUserMock.name = 'Nikos Papadopoulos II'
        SSTUserMock.sst_member_id = 1

        try {
            await sstService.Update(SSTUserMock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Não houve alterações')
        }
    })
})