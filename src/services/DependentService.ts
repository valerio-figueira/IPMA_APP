import UserDataSanitizer from "../helpers/UserDataSanitizer";
import DependentRepository from "../repositories/DependentRepository";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import LocationEntity from "../entities/LocationEntity";
import ContactEntity from "../entities/ContactEntity";
import DependentBundleEntities from "../entities/DependentBundleEntities";
import DependentEntity from "../entities/DependentEntity";
import MemberEntity from "../entities/MemberEntity";
import Database from "../db/Database";
import CustomError from "../utils/CustomError";
import MonthlyFeeEntity from "../entities/MonthlyFeeEntity";
import UserService from "./UserService";
import HolderService from "./HolderService";
import { validateUser } from "../utils/decorators/validateBody";
import MemberRepository from "../repositories/MemberRepository";
import IMember from "../interfaces/IMember";
import MonthlyFeeService from "./MonthlyFeeService";

type ID = number | string

export default class DependentService {
    private db: Database;
    private dependentRepository: DependentRepository;
    private userService: UserService;
    private holderService: HolderService;
    private memberRepository: MemberRepository;
    private monthlyFeeService: MonthlyFeeService;

    constructor(db: Database) {
        this.db = db;
        this.dependentRepository = new DependentRepository(db);
        this.memberRepository = new MemberRepository(db);
        this.monthlyFeeService = new MonthlyFeeService(db);
        this.holderService = new HolderService(db);
        this.userService = new UserService(db);
    }



    @validateUser('Dependent')
    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const dependentData = this.bundleEntities(body)

        // CHECK IF DEPENDENT ALREADY EXISTS
        await this.userService.Exists(dependentData.document)
        // CHECK IF HOLDER EXISTS
        await this.holderService.ReadOneSummary(body.holder_id)
        // CHECK IF HOLDER IS MEMBER OF ANY AGREEMENT
        await this.checkSubscriptionOfHolder(dependentData.member)

        // CREATE DEPENDENT, ADD SUBSCRIPTION AND MONTHLY FEE
        const transaction = await this.db.sequelize.transaction()

        try {
            const dependent = await this.dependentRepository.Create(dependentData, transaction)
            dependentData.member.dependent_id = dependent.dependent_id
            const subscription = await this.memberRepository.Create(dependentData.member, transaction)
            dependentData.monthly_fee.member_id = subscription.member_id
            await this.monthlyFeeService.Create(dependentData.monthly_fee, transaction)

            await transaction.commit()
            return this.ReadOne(body.holder_id, dependent.dependent_id)
        } catch (error: any) {
            await transaction.rollback()
            throw new CustomError(error.message, error.status || 400)
        }
    }




    async ReadAll(holder: string | number) {
        const dependents: any[] = await this.dependentRepository
            .ReadAll(holder);

        const holderData: Record<number, any> = {}

        for (let dependent of dependents) {
            const holderID = dependent.holder_id

            if (!holderData[holderID]) {
                const holderFinded: any = await this.holderService
                    .ReadOne(holderID)
                holderFinded['dependents'] = []
                holderData[holderID] = holderFinded
            }

            holderData[holderID]['dependents'].push({ ...dependent })
        }

        return Object.values(holderData)[0]
    }




    async ReadOne(holder: ID, dependent_id: ID) {
        return this.dependentRepository
            .ReadOne(holder, dependent_id);
    }




    async ReadOneSummary(holder: ID, dependent_id: ID) {
        return this.dependentRepository
            .ReadOneSummary(holder, dependent_id);
    }




    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const dependentData = this.bundleEntities(body)
        const holderID = dependentData.dependent.holder_id
        const dependentID = dependentData.dependent.dependent_id
        const userID = dependentData.user.user_id

        if (!userID) throw new CustomError('Identificação de usuário inválida', 400)
        if (!dependentID) throw new CustomError('Identificação de dependente inválida', 400)
        if (!holderID) throw new CustomError('Identificação de titular inválida', 400)

        // CHECK IF DEPENDENT EXISTS
        const exists = await this.ReadOne(holderID, dependentID)
        if (!exists) throw new CustomError('Dependente não existe na base de dados', 400)

        // UPDATE DEPENDENT
        const affectedCount = await this.dependentRepository.Update(dependentData)

        if (!affectedCount[0] && !affectedCount[0]) {
            throw new CustomError('Não houve alterações', 400)
        }

        return this.ReadOne(holderID, dependentID)
    }




    async Delete() { }



    private async checkSubscriptionOfHolder(query: IMember) {
        if (!query.agreement_id) throw new CustomError('Insira a identificação do convênio', 400)
        if (!query.holder_id) throw new CustomError('Insira a identificação do titular', 400)

        const result = await this.memberRepository.ifMemberExists(query)

        if (result) {
            if (result.active) return;
            throw new CustomError('O titular não está ativo no convênio', 400)
        }

        throw new CustomError('O titular não está registrado no convênio', 400)
    }



    private bundleEntities(body: any) {
        return new DependentBundleEntities({
            dependent: new DependentEntity(body),
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            member: new MemberEntity(body),
            monthly_fee: new MonthlyFeeEntity(body)
        })
    }

}