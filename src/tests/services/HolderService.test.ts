import 'jest'
import Database from '../../db/Database'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import HolderService from '../../services/HolderService'
import { firstHolder, firstHolderWithAuth, secondHolder, thirdHolder } from '../../utils/mocks/HolderMocks'
import CustomError from '../../utils/CustomError'

const db = new Database()
const accessHierarchyService = new AccessHierarchyService(db)
const holderService = new HolderService(db)

const resetDB = async () => {
    await db.syncModels()
    await db.clearDatabase()
}

describe('TEST for Holder Service layer', () => {
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

        await accessHierarchyService.Create({
            level_name: 'Common_User',
            parent_level_id: 1
        })
    })



    it('should NOT FIND any holder in all list', async () => {
        try {
            await holderService.ReadAll()
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Nenhum titular foi encontrado')
        }
    })



    it('should NOT READ one holder with summary info', async () => {
        try {
            await holderService.ReadOneSummary(80)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Nenhum registro encontrado!')
        }
    })



    it('should CREATE new holder', async () => {
        const res = await holderService.Create(firstHolder)

        console.log(res)
        expect(res).toBeInstanceOf(Object)
    })



    it('should CREATE one more holder with authentication', async () => {
        const res = await holderService.Create(secondHolder)

        expect(res).toBeInstanceOf(Object)
    })



    it('should NOT CREATE holder if it already exists', async () => {
        try {
            await holderService.Create(secondHolder)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Titular já existe na base de dados')
        }
    })



    it('should NOT CREATE holder with high level permission', async () => {
        try {
            await holderService.Create(thirdHolder)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Todo titular deve ser um usuário comum')
        }
    })



    it('should CREATE holder with common permissions', async () => {
        thirdHolder.hierarchy_id = 4
        const res = await holderService.Create(thirdHolder)

        expect(res).toBeInstanceOf(Object)
    })



    it('should READ ONE holder', async () => {
        const res = await holderService.ReadOne(2)

        expect(res).toBeInstanceOf(Object)
    })



    it('should READ ONE holder with summary info', async () => {
        const res = await holderService.ReadOneSummary(2)
        expect(res).toBeInstanceOf(Object)
    })



    it('should NOT FIND a specific holder', async () => {
        try {
            await holderService.ReadOne(80)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Nenhum registro encontrado!')
        }
    })



    it('should READ ALL holders', async () => {
        const res = await holderService.ReadAll()

        expect(res).toBeInstanceOf(Array)
    })



    it('should UPDATE ONE holder', async () => {
        thirdHolder.name = 'Nikos Papadopoulos II'
        thirdHolder.holder_id = 3

        const res = await holderService.Update(thirdHolder)

        expect(res).toBeInstanceOf(Object)
        expect(res).toHaveProperty('user')
        expect(res!.user!.name).toBe('NIKOS PAPADOPOULOS II')
    })



    it('should UPDATE ONE holder with authentication permission', async () => {
        const res = await holderService.Update(firstHolderWithAuth)
        expect(res).toBeInstanceOf(Object)
        expect(res).toHaveProperty('user')
        expect(res!.user?.name).toBe('Maria Konstantopoulos'.toLocaleUpperCase())
        expect(res!.user).toHaveProperty('authentication')
        expect(res?.user?.authentication).toHaveProperty('username')
        expect(res?.user?.authentication.username).toBe('MariaK')
    })



    it('should NOT UPDATE ONE holder if holder ID doesnt match any', async () => {
        try {
            await holderService.Update({ holder_id: 999 })
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Nenhum registro encontrado!')
        }
    })



    it('should NOT UPDATE ONE holder if body is empty', async () => {
        try {
            await holderService.Update({ holder_id: 3, user_id: 999 })
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Dados de usuário inválido')
        }
    })



    it('should DELETE ONE holder if body is empty', async () => {

        const res = await holderService.Delete(3)
        expect(res).toHaveProperty('message')
        expect(res.message).toBe('O titular foi removido com todas as suas dependências')
    })


    it('should READ ALL holders', async () => {
        const res = await holderService.ReadAll()
        expect(res).toBeInstanceOf(Array)
    })

})