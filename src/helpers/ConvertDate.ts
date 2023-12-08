import { isValid, parse } from "date-fns"



export function getJsDateFromExcel(excelDate: number) {
    const SECONDS_IN_DAY = 24 * 60 * 60
    const MISSING_LEAP_YEAR_DAY = SECONDS_IN_DAY * 1000
    const MAGIC_NUMBER_OF_DAYS = (25567 + 2)

    if (!Number(excelDate)) alert('wrong input format')

    const delta = excelDate - MAGIC_NUMBER_OF_DAYS
    const parsed = delta * MISSING_LEAP_YEAR_DAY
    console.log(parsed)
    return new Date(parsed)
}



export function validateAndConvertDate(value: string) {
    // Tenta analisar a data
    const date = parse(value, 'dd/MM/yyyy', new Date())

    if (isValid(date)) return date
    else return null
}