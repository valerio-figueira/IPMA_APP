import 'jest'
import AgreementService from '../../services/AgreementService'
import AgreementModel from '../../models/AgreementModel'
import Database from '../../db/Database'
import IAgreement from '../../interfaces/IAgreement'
import CustomError from '../../utils/CustomError'

const db = new Database()
const agreementService = new AgreementService(db)

describe('TEST for Access Hierarchy Service', () => {
    beforeAll(async () => {
        await db.syncModels()
        await db.clearDatabase()
    })

    it('should create new agreement', async () => {
        const newAgreement: IAgreement = {
            agreement_name: 'Unimed',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        const response = await agreementService.Create(newAgreement)

        expect(response).toBeInstanceOf(AgreementModel)
    })

    it('should read all agreements', async () => {
        const response = await agreementService.ReadAll()

        expect(response).toBeInstanceOf(Array)
    })

    it('should read one agreement', async () => {
        const response = await agreementService.ReadOne(1)

        expect(response).toBeInstanceOf(Object)
    })

    it('should update one agreement', async () => {
        const mock: IAgreement = {
            agreement_id: 1,
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        const response = await agreementService.Update(mock)

        expect(response).toBeInstanceOf(AgreementModel)
    })

    it('should not update an agreement without changes', async () => {
        const mock: IAgreement = {
            agreement_id: 1,
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        try {
            await agreementService.Update(mock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('O Convênio não foi alterado ou localizado')
        }
    })

    it('should not update an agreement without id', async () => {
        const mock: IAgreement = {
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        try {
            await agreementService.Update(mock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Convênio não localizado')
        }
    })

    it('should not update an agreement without id', async () => {
        const mock: IAgreement = {
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        try {
            await agreementService.Update(mock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Convênio não localizado')
        }
    })

    it('should not delete an agreement without id', async () => {
        const mock: IAgreement = {
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        try {
            await agreementService.Delete(mock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('Convênio não localizado')
        }
    })

    it('should not delete an agreement if not exists', async () => {
        const mock: IAgreement = {
            agreement_id: 10,
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        try {
            await agreementService.Delete(mock)
        } catch (error: any) {
            expect(error).toBeInstanceOf(CustomError)
            expect(error.message).toBe('O Convênio não foi removido ou localizado')
        }
    })

    it('should delete an agreement', async () => {
        const mock: IAgreement = {
            agreement_id: 1,
            agreement_name: 'UNIMED',
            description: 'Convênio médico para funcionários públicos da prefeitura de Monte Alegre de Minas, aposentados ou ativos.'
        }

        const response = await agreementService.Delete(mock)

        expect(response).toHaveProperty('message')
        expect(response.message).toBe('Convênio removido com sucesso!')
    })
})