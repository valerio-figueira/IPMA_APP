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


    it('should CREATE new member in social security team', async () => {
        const response = await sstService.Create(UserMock)
        expect(response).toBeInstanceOf(Object)
    })

    it('should INSERT another member in social security team', async () => {
        const response = await sstService.Create(SSTUserMock)
        expect(response).toBeInstanceOf(Object)
    })

    it('should READ ONE member', async () => {
        const response = await sstService.ReadOne(2)
        expect(response).toBeInstanceOf(Object)
    })

    it('should UPDATE a member in social security team', async () => {
        SSTUserMock.name = 'Nikos Papadopoulos II'
        SSTUserMock.sst_member_id = 1

        const response = await sstService.Update(SSTUserMock)

        expect(response).toBeInstanceOf(Object)
        expect(response).toHaveProperty('message')
        expect(response?.message).toBe('Atualizado com sucesso')
    })

    it('should NOT UPDATE a member in social security team', async () => {
        SSTUserMock.name = 'Nikos Papadopoulos II'
        SSTUserMock.sst_member_id = 1

        try {
            await sstService.Update(SSTUserMock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Não houve alterações')
        }
    })

    it('should NOT READ any member in social security team', async () => {
        SSTUserMock.sst_member_id = 100

        try {
            await sstService.Update(SSTUserMock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('O membro não foi localizado')
        }
    })

    it('should READ ALL members in social security team', async () => {
        const res = await sstService.ReadAll()

        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(2)
    })

    it('should DELETE ONE member in social security team', async () => {
        const res = await sstService.Delete(2)

        expect(res).toHaveProperty('message')
        expect(res?.message).toBe('Usuário removido do sistema')
    })

    it('should NOT DELETE a member in social security team', async () => {

        try {
            await sstService.Delete(100)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Não foi localizado')
        }
    })

    it('should GET ALL members in social security team', async () => {
        const res = await sstService.ReadAll()

        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(1)
    })
})