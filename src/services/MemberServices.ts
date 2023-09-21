import MemberRepository from "../repositories/MemberRepository";


export default class MemberService {
    memberRepository: MemberRepository;

    constructor() {
        this.memberRepository = new MemberRepository();
    }

    async Create() {
        return this.memberRepository.Create(undefined);
    }

    async ReadAll() {
        return this.memberRepository.ReadAll();
    }

    async ReadOne() {
        return this.memberRepository.ReadOne();
    }

    async Update() {
        return this.memberRepository.Update();
    }

    async Delete() {
        return this.memberRepository.Delete();
    }

}