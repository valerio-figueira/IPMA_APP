


class ConvertSQLData {
    static convertDate(str: string) {
        if (!str) return

        const parts = str.split("-")
        return `${parts[2]}/${parts[1]}/${parts[0]}`
    }



    static convertCPF(str: string) {
        if (!str) return
        return str.slice(0, 3) + '.' + str.slice(3, 6) + '.' + str.slice(6, 9) + '-' + str.slice(9, 11)
    }



    static convertPhoneNumber(str: string | undefined | null) {
        if (!str) return
        if (str.length === 11) return '(' + str.slice(0, 2) + ') ' + str.slice(2, 7) + '-' + str.slice(7, 11)
        if (str.length === 10) return '(' + str.slice(0, 2) + ') ' + str.slice(2, 6) + '-' + str.slice(6, 11)
    }
}



export default ConvertSQLData