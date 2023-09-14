import { IHolder } from "../interfaces/IHolder";
import HolderRepository from "../repositories/HolderRepository";
import CustomError from "../classes/CustomError";

export default class HolderService {
    holderRepository: HolderRepository;

    constructor() {
        this.holderRepository = new HolderRepository();
    }

    async Create(body: IHolder) {
        return this.holderRepository.Create(body);
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