import 'jest'
import SocialSecurityTeamService from '../../services/SocialSecurityTeamService'
import { UserMock } from '../../utils/mocks/SSTMock'


const sstService = new SocialSecurityTeamService()

describe('TEST for SST service', () => {
    it('should create new member for social security team', async () => {
        
        const response = await sstService.Create(UserMock)

        console.log(response)

        expect(response).toBeInstanceOf(Object)
    })

    it('should GET a member', async () => {
        
        const response = await sstService.ReadOne(1)

        console.log(response)

        expect(response).toBeInstanceOf(Object)
    })
})