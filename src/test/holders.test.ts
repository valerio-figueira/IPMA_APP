import supertest from 'supertest'
import Server from '../server'
require('dotenv').config()


const app = new Server(9292).APP
const request = supertest(app)

describe('GET /api/v1/holders', () => {
    it('should return holders', async () => {
        return request
            .get('/api/v1/holders')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((res) => {
                expect(res.statusCode).toBe(200);
            })
    });
});