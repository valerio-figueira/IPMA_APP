import { validateAndConvertDate } from "./ConvertDate"
import StringSanitizer from "./StringSanitizer"
import format from "date-fns/format"

export default class UserDataSanitizer {
    static sanitizeBody(data: any) {
        for (const key in data) {
            data[key] = key === 'cpf' ? this.formatCPF(data[key]) : data[key]
            data[key] = key === 'birth_date' ? this.filterDate(data[key]) : data[key]
            data[key] = key === 'issue_date' ? this.filterDate(data[key]) : data[key]
            data[key] = this.sanitizeFields(key, data[key])
            data[key] = StringSanitizer.convertToUpperCase(key, data[key])
            data[key] = StringSanitizer.sanitizeEmptyFields(data[key])
            data[key] = StringSanitizer.sanitizeLetters(data[key])
        }
    }

    static sanitizeQuery(data: any) {
        for (const key in data) {
            this.sanitizeNestedObject(data[key]);
        }

        return data;
    }

    static sanitizeNestedObject(data: any) {
        if (typeof data !== 'object') return

        for (const key in data) {
            if (typeof data[key] === 'string') data[key] = StringSanitizer.convertToUpperCase(key, data[key])
            if (key.match('birth_date')) data[key] = this.filterDate(data[key])
            if (key.match('cpf')) data[key] = this.formatCPF(data[key])
            if (key.match('issue_date')) data[key] = this.filterDate(data[key])
            if (typeof data[key] === 'object' && data[key] !== null) {
                this.sanitizeNestedObject(data[key]);
            }
        }
    }

    static formatCPF(cpf: string) {
        const digits = cpf.replace(/\D/g, '')

        if (digits.length !== 11) throw new Error('CPF deve conter 11 dígitos.')

        const firstGroup = digits.slice(0, 3)
        const secondGroup = digits.slice(3, 6)
        const thirdGroup = digits.slice(6, 9)
        const fourthGroup = digits.slice(9)

        return `${firstGroup}.${secondGroup}.${thirdGroup}-${fourthGroup}`
    }

    static sanitizeFields(key: string, data: any) {
        if (!data) return null
        if (key.match('identity')) return data.replace(/\W/g, '');
        if (key.match('phone_number')) return data.replace(/\D/g, '');
        if (key.match('residential_phone')) return data.replace(/\D/g, '');
        return data
    }

    static sanitizeModel(model: any) {
        const newData: any = {}
        for (let key1 in model) {
            for (let key2 in model[key1].dataValues) {
                newData[key2] = model[key1][key2]
            }
        }
        this.removeUnnecessaryID(newData)
        newData.cpf = this.formatCPF(newData.cpf)
        newData.birth_date = this.filterDate(newData.birth_date)
        newData.issue_date = this.filterDate(newData.issue_date)
        return newData
    }

    static removeUnnecessaryID(obj: any) {
        if (obj.document_id) delete obj.document_id
        if (obj.contact_id) delete obj.contact_id
        if (obj.location_id) delete obj.location_id
    }

    static filterDate(value: any) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if (!value) return null
        if (value === '0000-00-00') return null
        if (regex.test(value)) return new Date(value)
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) { // CONVERT FROM DD/MM/YYYY FORMAT TO YYYY/MM/DD
            const date = this.formatDate(value)
            return date ? format(date, 'yyyy-MM-dd') : null
        }

        return validateAndConvertDate(value)
    }

    static formatDate(str: string) {
        const pieces = str.split('/')
        const day = parseInt(pieces[0], 10);
        const month = parseInt(pieces[1], 10) - 1; // O mês começa em 0 (janeiro) no objeto Date
        const year = parseInt(pieces[2], 10);

        const data = new Date(year, month, day);

        // Verifica se a data resultante é válida
        if (isNaN(data.getTime())) {
            return null; // Data inválida
        }

        return data;
    }
}
