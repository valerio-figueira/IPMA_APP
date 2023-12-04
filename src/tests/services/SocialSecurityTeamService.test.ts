import 'jest'
import SocialSecurityTeamService from '../../services/SocialSecurityTeamService'
import { UserMock, SSTUserMock } from '../../utils/mocks/SSTMock'
import Database from '../../db/Database'
import CustomError from '../../utils/CustomError'
import SSTErrors from '../../utils/errors/SocialSecurityErrors'


const db = new Database()
const sstService = new SocialSecurityTeamService(db)


const resetDB = async () => {
    await db.syncModels()
    await db.clearDatabase()
}


describe('TEST for SST service', () => {
    beforeAll(async () => {
        await resetDB()
    })


    it('should NOT CREATE new member in social security team with no role', async () => {
        UserMock.role = ''

        try {
            expect(await sstService.Create(UserMock)).toThrowError(CustomError)
        } catch (error: any) {
            expect(error.message).toBe('Insira o cargo')
        }
    })


    it('should CREATE new member in social security team', async () => {
        UserMock.role = 'Administrador(a)'
        const response = await sstService.Create(UserMock)
        expect(response).toBeInstanceOf(Object)
    })

    it('should NOT CREATE new member in social security team if already exists', async () => {
        try {
            expect(await sstService.Create(UserMock)).toThrowError(CustomError)
        } catch (error: any) {
            expect(error.message).toBe('Usuário ou documento já existe na base de dados')
        }
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
        expect(response?.message).toBe(SSTErrors.UpdatedSuccessfully)
    })

    it('should NOT UPDATE a member in social security team', async () => {
        SSTUserMock.name = 'Nikos Papadopoulos II'
        SSTUserMock.sst_member_id = 1

        try {
            await sstService.Update(SSTUserMock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(SSTErrors.NotAffected)
        }
    })

    it('should NOT READ any member in social security team', async () => {
        SSTUserMock.sst_member_id = 100

        try {
            await sstService.Update(SSTUserMock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(SSTErrors.NotFound)
        }
    })

    it('should READ ALL members in social security team', async () => {
        const res = await sstService.ReadAll({})

        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(2)
    })

    it('should DELETE ONE member in social security team', async () => {
        const res = await sstService.Delete(2)

        expect(res).toHaveProperty('message')
    })

    it('should NOT DELETE a member in social security team', async () => {

        try {
            await sstService.Delete(100)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(SSTErrors.NotFound)
        }
    })

    it('should GET ALL members in social security team', async () => {
        const res = await sstService.ReadAll({})

        expect(res).toBeInstanceOf(Array)
        expect(res).toHaveLength(1)
    })
})