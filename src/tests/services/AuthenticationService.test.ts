import Database from '../../db/Database'
import CustomError from '../../utils/CustomError'
import AccessHierarchyService from '../../services/AccessHierarchyService'
import AuthenticationService from '../../services/AuthenticationService'
import { BadRequest } from '../../utils/messages/APIResponse'
import AuthenticationEntity from '../../entities/AuthenticationEntity'
import HolderService from '../../services/HolderService'
import { firstHolder, secondHolder, thirdHolder } from '../../utils/mocks/HolderMocks'
import AuthenticationModel from '../../models/AuthenticationModel'
import SocialSecurityTeamService from '../../services/SocialSecurityTeamService'
import { SSTUserMock } from '../../utils/mocks/SSTMock'
import Errors from '../../utils/errors/Errors'

const db = new Database()
const accessHierarchyService = new AccessHierarchyService(db)
const authenticationService = new AuthenticationService(db)
const holderService = new HolderService(db)
const sstService = new SocialSecurityTeamService(db)

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
            level_name: 'Advanced_Employee',
            parent_level_id: 2
        })

        await accessHierarchyService.Create({
            level_name: 'Common_Employee',
            parent_level_id: 3
        })

        await accessHierarchyService.Create({
            level_name: 'Common_User',
            parent_level_id: 1
        })

        const holder = await holderService.Create(firstHolder)
        console.log('HOLDER')
        console.log(holder)
        const memberTeam = await sstService.Create(SSTUserMock)
        console.log('MEMBER TEAM')
        console.log(memberTeam)
    })

    it('should NOT CREATE account with empty body', async () => {
        try {
            const res = await authenticationService
                .Create({} as AuthenticationEntity)

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
        }
    })

    it('should NOT CREATE account if user id is not specified', async () => {
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



    it('should NOT CREATE account without hierarchy ID', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 100,
                    hierarchy_id: null as any,
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



    it('should NOT CREATE account with invalid user ID', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 100,
                    hierarchy_id: 4,
                    username: 'Fulano',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Identificação de usuário inválida')
        }
    })



    it('should NOT CREATE account without username or password', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 100,
                    hierarchy_id: 4,
                    username: '',
                    password: '',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
        }
    })


    it('should NOT CREATE account for holder if it is not common user', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 1,
                    hierarchy_id: 3,
                    username: 'MariaK',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            console.log(error)
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
            expect(error.status).toBe(400)
        }
    })


    it('should NOT CREATE account for holder if it is root level', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 1,
                    hierarchy_id: 1,
                    username: 'MariaK',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            console.log(error)
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
            expect(error.status).toBe(400)
        }
    })


    it('should NOT CREATE account for holder if it is administrator level', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 1,
                    hierarchy_id: 2,
                    username: 'MariaK',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            console.log(error)
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
            expect(error.status).toBe(400)
        }
    })


    it('should NOT CREATE account for holder if it is advanced employee level', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 1,
                    hierarchy_id: 2,
                    username: 'MariaK',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            console.log(error)
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
            expect(error.status).toBe(400)
        }
    })

    it('should NOT CREATE account for holder if it is common employee level', async () => {
        try {
            const res = await authenticationService
                .Create({
                    user_id: 1,
                    hierarchy_id: 2,
                    username: 'MariaK',
                    password: 'supersenha10',
                    user_photo: ''
                })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            console.log(error)
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe(BadRequest.MESSAGE)
            expect(error.status).toBe(400)
        }
    })


    it('should CREATE account for holder as common user', async () => {
        const res = await authenticationService
            .Create({
                user_id: 1,
                hierarchy_id: 5,
                username: 'MariaK',
                password: 'supersenha10',
                user_photo: ''
            })

        expect(res).toBeInstanceOf(AuthenticationModel)
        expect(res?.hierarchy_id).toBe(5)
        expect(res?.username).toBe('MariaK')
        expect(res?.password).toBe('supersenha10')
    })


    it('should READ ONE account', async () => {
        const res = await authenticationService.ReadOne(1)

        expect(res).toBeInstanceOf(Object)
        expect(res?.username).toBe('MariaK')
    })


    it('should NOT UPDATE account without account ID', async () => {
        try {
            const res = await authenticationService.Update({
                user_id: 1,
                hierarchy_id: 5,
                username: 'MariaKo',
                password: 'supersenha10',
                user_photo: ''
            })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error.message).toBe(Errors.UserIdRequired.message)
            expect(error.status).toBe(400)
        }
    })


    it('should UPDATE account', async () => {
        const res = await authenticationService.Update({
            authentication_id: 1,
            user_id: 1,
            hierarchy_id: 5,
            username: 'MariaKo',
            password: 'supersenha10',
            user_photo: ''
        })

        expect(res).toBeInstanceOf(Object)
        expect(res?.username).toBe('MariaKo')
    })

    it('should NOT CREATE account for SSTeam member with administrator level', async () => {
        try {
            const res = await authenticationService.Create({
                user_id: 2,
                hierarchy_id: 2,
                username: 'NikosP',
                password: 'supersenha10',
                user_photo: ''
            })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error.message).toBe(Errors.BadRequest.message)
            expect(error.status).toBe(400)
        }
    })

    it('should CREATE account for SSTeam member', async () => {
        const res = await authenticationService.Create({
            user_id: 2,
            hierarchy_id: 5,
            username: 'NikosP',
            password: 'supersenha10',
            user_photo: ''
        })

        expect(res).toBeInstanceOf(Object)
        expect(res?.username).toBe('NikosP')
        expect(res?.hierarchy_id).toBe(5)
    })


    it('should NOT CREATE account for SSTeam member if already exists', async () => {
        try {
            const res = await authenticationService.Create({
                user_id: 2,
                hierarchy_id: 5,
                username: 'NikosP',
                password: 'supersenha10',
                user_photo: ''
            })

            expect(res).toThrowError(CustomError)
        } catch (error: any) {
            expect(error.message).toBe(Errors.BadRequest.message)
            expect(error.status).toBe(400)
        }
    })


    it('should READ ALL accounts', async () => {
        const res = await authenticationService.ReadAll()

        expect(res).toBeInstanceOf(Array)
        expect(res.length).toBe(2)
    })

})