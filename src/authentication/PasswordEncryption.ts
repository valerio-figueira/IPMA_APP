import * as bcrypt from "bcryptjs"
import CustomError from "../utils/CustomError"




class PasswordEncryption {

    constructor() { }


    static async createHash(password: string, saltValue: number) {
        try {
            const salt = await bcrypt.genSalt(saltValue)
            const hash = await bcrypt.hash(password, salt)

            return hash
        } catch (error: any) {
            throw new Error(error.message)
        }
    }


    static async verifyPassword(password: string, hash: string) {
        const res = await bcrypt.compare(password, hash)

        if (res) return
        else throw new CustomError('Credenciais inválidas. Autenticação negada.', 401)
    }
}



export default PasswordEncryption