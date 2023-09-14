import { IHolder } from "../interfaces/IHolder";

export default class HolderRepository {
    constructor() { }

    async Create(query: IHolder) { }

    async ReadAll(query: { nome: string, tipo: string }) { }

    async ReadOne(holder_id: string) { }

    async Update(holder_id: string, query: IHolder) { }

    async Delete(holder_id: string) { }
}