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
import * as path from "path";
import * as fs from "fs";
import { UploadedFile } from "express-fileupload";
import { format } from "date-fns";
import { readFile, utils } from "xlsx";
import { getJsDateFromExcel } from "../helpers/ConvertDate";


export default class HolderService {
    holderRepository: HolderRepository
    userService: UserService

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
        const error = new CustomError('Nenhuma planilha foi enviada', 400)
        if (!req.files || Object.keys(req.files).length === 0) throw error

        const table = req.files.table as UploadedFile
        const currentTime = format(new Date(), 'dd-MM-yyyy')
        const fileName = `holders-table-${currentTime}.xlsx`
        const filePath = path.join(__dirname, '../temp', fileName)

        try {
            await new Promise<void>((resolve, reject) => {
                table.mv(filePath, (err) => {
                    if (err) reject(err)
                    else resolve()
                })
            })

            const workbook = readFile(filePath)
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            const rows = utils.sheet_to_json(sheet, { header: 1 })
            const columns: any = rows[0]

            const jsonResult: any = this.createJsonFromTable(columns, rows)

            if (jsonResult.length > 0) {
                const { message } = await this.holderRepository.BulkCreate(jsonResult)
                return { message, fileName, filePath }
            } else {
                throw new Error('Ocorreu um erro ao processar os dados!')
            }
        } catch (error: any) {
            console.log(error)
            fs.unlinkSync(filePath)
            throw new CustomError('Erro ao processar a planilha.', 500)
        }
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



    @validateUser('Holder')
    async Update(body: any) {
        UserDataSanitizer.sanitizeBody(body)
        const holderData = this.bundleEntities(body)
        const holderID = holderData.holder.holder_id
        const userID = holderData.user.user_id

        if (holderID) await this.ReadOne(holderID)
        if (userID) await this.userService.throwErrorIfNotExists(userID)
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

            row.forEach((value: any, index: any) => {
                const column = columns[index]
                if (column === 'birth_date') {
                    value = format(new Date(value), 'yyyy-MM-dd')
                }
                if (column === 'marital_status') {
                    if (value.match('Solteiro')) value = 'Solteiro(a)'
                    if (value.match('Casado')) value = 'Casado(a)'
                    if (value.match('Viúvo')) value = 'Viúvo(a)'
                    if (value.match('Divorciado')) value = 'Divorciado(a)'
                }
                user[column] = value
            })

            if (user.name) {
                UserDataSanitizer.sanitizeBody(user)
                return this.bundleEntities(user)
            }

            return null
        }).filter(Boolean)
    }
}