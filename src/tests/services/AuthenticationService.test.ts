import Database from '../../db/Database'
import CustomError from '../../utils/CustomError'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import AuthenticationService from '../../services/AuthenticationService'
import { BadRequest } from '../../utils/messages/APIResponse'
import AuthenticationEntity from '../../entities/AuthenticationEntity'
import HolderService from '../../services/HolderService'
import { firstHolder, secondHolder, thirdHolder } from '../../utils/mocks/HolderMocks'

const db = new Database()
const accessHierarchyService = new AccessHierarchyService(db)
const authenticationService = new AuthenticationService(db)
const holderService = new HolderService(db)

const resetDB = async () => {
    await db.syncModels()
    await db.clearDatabase()
}

describe('TEST for Authentication Service', () => {
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

        await holderService.Create(firstHolder)
        await holderService.Create(secondHolder)
        await holderService.Create(thirdHolder)
    })

    it('should NOT CREATE any authentication', async () => {
        try {
            const res = await authenticationService
                .Create({} as AuthenticationEntity)

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
        }
    })

    it('should NOT CREATE any record if user id is not specified', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: null as any,
                    hierarchy_id: 4,
                    username: 'Fulano',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
        }
    })

})