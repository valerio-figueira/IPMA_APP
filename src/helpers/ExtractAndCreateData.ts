import CustomError from "../utils/CustomError"
import { UploadedFile } from "express-fileupload"
import ExtractDataFromTable from "./ExtractDataFromTable"
import { format } from "date-fns"
import * as fs from "fs"
import * as path from "path"



type TCreateJson = (column: any, rows: any[]) => Record<string, any> | null[]
type TBulkCreate = (json: any[]) => Promise<Record<string, any>>



async function ExtractAndCreateData(
    table: UploadedFile,
    fileNameText: string,
    createJson: TCreateJson,
    bulkCreateFn: TBulkCreate
) {
    const currentTime = format(new Date(), 'dd-MM-yyyy')
    const fileName = `${fileNameText}-${currentTime}.xlsx`
    const filePath = path.join(__dirname, '../temp', fileName)

    try {
        await new Promise<void>((resolve, reject) => {
            table.mv(filePath, (err) => {
                if (err) reject(err)
                else resolve()
            })
        })

        const { rows, columns } = ExtractDataFromTable(filePath)
        const jsonResult: any | null[] = createJson(columns, rows)

        if (jsonResult.length > 0) {
            const { message } = await bulkCreateFn(jsonResult)
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


export default ExtractAndCreateData