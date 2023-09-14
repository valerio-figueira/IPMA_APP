import { IHolder } from "../interfaces/IHolder";
import HolderRepository from "../repositories/HolderRepository";
import { UserAttributes } from "../classes/UserSchema";

export default class HolderService {
    holderRepository: HolderRepository;

    constructor() {
        this.holderRepository = new HolderRepository();
    }

    async Create(body: IHolder) {
        const userData = new UserAttributes(body);
        userData.addHolder(body.holder)
        return this.holderRepository.Create(userData);
    }

    async ReadAll(query: any) {
        return this.holderRepository.ReadAll(query)
    }

    async ReadOne(holder_id: string) {
        return await this.holderRepository.ReadOne(holder_id);
    }

    async Update(holder_id: string, query: IHolder) {
        return this.holderRepository.Update(holder_id, query);
    }

    async Delete(holder_id: string) {
        return this.holderRepository.Delete(holder_id);
    }


}