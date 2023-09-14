import { IHolder } from "../interfaces/IHolder";
import DependentRepository from "../repositories/DependentRepository";


export default class DependentService {
    dependentRepository: DependentRepository;

    constructor() {
        this.dependentRepository = new DependentRepository();
    }

    async Create(body: IHolder) {
        return this.dependentRepository.Create(undefined);
    }

    async ReadAll(holder: string) {
        return this.dependentRepository.ReadAll(holder);
    }

    async ReadOne(holder: string, dependent: string) {
        return this.dependentRepository.ReadOne(holder, dependent);
    }

    async Update() { }

    async Delete() { }

}