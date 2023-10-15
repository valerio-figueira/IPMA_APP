import supertest from 'supertest'
import Server from '../server'
import { mockHolderSuccess, mockHolderError, mockHolderRes } from './mocks/mockHolders'
require('dotenv').config()


const app = new Server(9292).APP
const request = supertest(app)

describe('/api/v1/holders', () => {
    it('should return no holders', async () => {
        const res = await request.get('/api/v1/holders')

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toEqual('Nenhum titular foi encontrado')
    });

    it('should return 400 while creating holder', async () => {
        const res = await request.post('/api/v1/holders')
        .send(mockHolderError)

        expect(res.status).toBe(400)
    })

    it('should return 201 while creating holder', async () => {
        const res = await request.post('/api/v1/holders')
        .send(mockHolderSuccess)

        expect(res.status).toBe(201)
        expect(res.body).toEqual(expect.objectContaining(mockHolderRes))
    })

    it('should return holders', async () => {
        const res = await request.get('/api/v1/holders')

        expect(res.status).toBe(200)
        expect(res.body).toEqual(mockHolderRes)
    });
});