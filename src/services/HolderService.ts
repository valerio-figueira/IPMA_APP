import HolderRepository from "../repositories/HolderRepository";
import UserEntity from "../entities/UserEntity";
import DocumentEntity from "../entities/DocumentEntity";
import ContactEntity from "../entities/ContactEntity";
import LocationEntity from "../entities/LocationEntity";
import CustomError from "../utils/CustomError";
import UserDataSanitizer from "../helpers/UserDataSanitizer";
import HolderBundleEntities from "../entities/HolderBundleEntities";
import HolderEntity from "../entities/HolderEntity";
import MemberEntity from "../entities/MemberEntity";
import Database from "../db/Database";
import { validateUser } from "../utils/decorators/validateBody";
import UserService from "./UserService";
import { Request } from "express";
import { UploadedFile } from "express-fileupload";
import ExtractAndCreateData from "../helpers/ExtractAndCreateData";


export default class HolderService {
    private holderRepository: HolderRepository
    private userService: UserService

    constructor(db: Database) {
        this.holderRepository = new HolderRepository(db)
        this.userService = new UserService(db)
    }


    @validateUser('Holder')
    async Create(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)

        await this.userService.Exists(holderData.document)

        if (holderData.holder.subscription_number) {
            const exists = await this.holderRepository.ReadAll({
                subscription_number: holderData.holder.subscription_number
            })
            const message = 'Já existe um titular com esta matrícula!'
            if (exists.length > 0) throw new CustomError(message, 400)
        }


        return this.holderRepository.Create(holderData)
    }




    async BulkCreate(req: Request) {
        if (!req.files || Object.keys(req.files).length === 0) {
            throw new CustomError('Nenhuma planilha foi enviada', 400)
        }

        const table = req.files.table as UploadedFile

        const { message, fileName, filePath } = await ExtractAndCreateData(
            table, 'holder-data',
            this.createJsonFromTable.bind(this),
            this.holderRepository.BulkCreate.bind(this.holderRepository))

        return { message, fileName, filePath }
    }




    async ReadAll(query: any) {
        const holders = await this.holderRepository.ReadAll(query)

        if (holders.length === 0) throw new CustomError('Nenhum titular foi encontrado', 400)

        const totalCount = await this.holderRepository.totalCount(query)
        const totalPages = Math.ceil(totalCount / (query.pageSize || 10))
        const response = []

        response.push(holders, {
            currentPage: query.page || 1,
            pageSize: query.pageSize || 10,
            totalCount: totalCount,
            totalPages: totalPages
        })

        return response
    }




    async ReadOne(holder_id: string | number) {
        const holderData = await this.holderRepository.ReadOne(holder_id);

        if (!holderData) throw new CustomError('Nenhum registro encontrado!', 400)

        return holderData
    }




    async ReadOneSummary(holder_id: string | number) {
        const holderData = await this.holderRepository.ReadOneSummary(holder_id);

        if (!holderData) throw new CustomError('Nenhum registro encontrado!', 400)

        return holderData
    }




    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holder = await this.ReadOne(body.holder_id ? body.holder_id : -1)
        await this.userService.throwErrorIfNotExists(holder.user_id)
        body.user_id = holder.user_id
        const holderData = this.bundleEntities(body)

        if (!holderData.holder) throw new CustomError('Falha ao processar os dados do titular', 400)
        return this.holderRepository.Update(holderData)
    }




    async Delete(holder_id: string | number) {
        return this.holderRepository.Delete(holder_id)
    }




    async findHolderByUserId(user_id: string | number) {
        return this.holderRepository.findHolderByUserId(user_id)
    }





    private bundleEntities(body: any) {
        return new HolderBundleEntities({
            holder: new HolderEntity(body),
            user: new UserEntity(body),
            document: new DocumentEntity(body),
            contact: new ContactEntity(body),
            location: new LocationEntity(body),
            member: new MemberEntity(body)
        })
    }




    private createJsonFromTable(columns: any, rows: any[]) {
        return rows.slice(1).map((row: any) => {
            const user: Record<string, any> = {}
            const valueNames = [/Solteiro/i, /Casado/i, /Viúvo/i, /Divorciado/i]

            row.forEach((value: any, index: any) => {
                const column = columns[index]
                if (column === 'marital_status') {
                    if (valueNames.includes(value)) value += '(a)';
                }
                user[column] = value
            })

            this.validateHolderInfo(user)

            if (user.name && user.cpf) {
                UserDataSanitizer.sanitizeBody(user)
                user.birth_date = new Date(user.birth_date).toLocaleDateString()
                return this.bundleEntities(user)
            }

            return null
        }).filter(Boolean)
    }


    private validateHolderInfo(holder: Record<string, any>) {
        if (!holder.name) throw new CustomError('Está faltando o nome do titular!', 400)
        if (!holder.cpf) throw new CustomError('Está faltando o CPF do titular!', 400)
    }
}