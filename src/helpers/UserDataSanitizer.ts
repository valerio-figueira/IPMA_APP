import StringSanitizer from "./StringSanitizer"

export default class UserDataSanitizer {
    static sanitizeBody(data: any) {
        for (const key in data) {
            data[key] = this.filterDate(data[key])
            data[key] = this.sanitizeFields(key, data[key])
            data[key] = StringSanitizer.convertToUpperCase(key, data[key])
            data[key] = StringSanitizer.sanitizeEmptyFields(data[key])
            data[key] = StringSanitizer.sanitizeLetters(data[key])
        }
        console.log(data)
    }

    static sanitizeQuery(data: any) {
        for(let key in data) {
            if(typeof data[key] === 'string') data[key] = StringSanitizer.convertToUpperCase(key, data[key])
            if(key.match('cpf')) data[key] = this.formatCPF(data[key])
            if(key.match('data_nasc')) data[key] = this.filterDate(data[key])
            if(key.match('data_expedicao')) data[key] = this.filterDate(data[key])
            if(data[key] === null) data[key] = undefined
        }

        return data
    }

    static formatCPF(cpf: string) {
        return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static sanitizeObjectKeys(obj: any) {
        for (let key in obj) {
            if (key.match('contact.')) {
                obj[key.replace('contact.', '')] = obj[key]
                delete obj[key]
            }
            if (key.match('document.')) {
                obj[key.replace('document.', '')] = obj[key]
                delete obj[key]
            }
            if (key.match('location.')) {
                obj[key.replace('location.', '')] = obj[key]
                delete obj[key]
            }
        }
    }

    static sanitizeFields(key: string, data: any) {
        if(!data) return null
        if(key.match('status')) this.filterStatus(data[key])
        if (key.match('cpf')) return data.replace(/\D/g, '');
        if (key.match('identidade')) return data.replace(/\W/g, '');
        if (key.match('celular')) return data.replace(/\D/g, '');
        if (key.match('residencial')) return data.replace(/\D/g, '');
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
        newData.data_nasc = this.filterDate(newData.data_nasc)
        newData.data_expedicao = this.filterDate(newData.data_expedicao)
        return newData
    }

    static removeUnnecessaryID(obj: any) {
        if (obj.id_documento) delete obj.id_documento
        if (obj.id_contato) delete obj.id_contato
        if (obj.id_localizacao) delete obj.id_localizacao
    }

    static filterStatus(obj: any) {
        if(obj === 'Aposentado') return
        if(obj === 'Ativo') return

        return null
    }

    static filterDate(obj: any) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;

        if(!obj) return null
        if(obj === '0000-00-00') return null
        if(regex.test(obj)) return obj.replace(/-/g, '/')

        return obj
    }
}
