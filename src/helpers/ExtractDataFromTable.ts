import { readFile, utils } from "xlsx"



function ExtractDataFromTable(filePath: string) {
    const workbook = readFile(filePath)
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows = utils.sheet_to_json(sheet, { header: 1 })
    const columns: any = rows[0]

    return { rows, columns }
}


export default ExtractDataFromTable