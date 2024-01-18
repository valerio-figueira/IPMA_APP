import Database from "../db/Database"
import SecurityKeyManager from "../secure/SecurityKeyManager";
import format from "date-fns/format";
import * as path from "path";


class SecurityKeyService {
    private db: Database;
    private securityManager: SecurityKeyManager

    constructor(db: Database) {
        this.db = db
        this.securityManager = new SecurityKeyManager()
    }


    GenerateRSAKeys() {
        const { publicKey, privateKey } = this.securityManager.generateRSAKeys()

        const pubKeyPath = this.createFilePath('assymmetric', 'pub_key', 'pem')
        const privKeyPath = this.createFilePath('assymmetric', 'priv_key', 'pem')

        this.securityManager.saveRSAPublicKeyToFile(publicKey, pubKeyPath)
        this.securityManager.saveRSAPrivateKeyToFile(privateKey, privKeyPath)

        return { message: 'As chaves RSA foram geradas e salvas!' }
    }



    async GenerateSymmetricKey() {
        const { key, iv } = this.securityManager.generateSymmetricKey()
        const keyPath = this.createFilePath('symmetric', 'symmetric-key', 'bin')
        const ivPath = this.createFilePath('symmetric', 'iv-key', 'bin')

        this.securityManager.saveSymmetricKeyToFile(key, keyPath)
        this.securityManager.saveSymmetricKeyToFile(iv, ivPath)

        await this.db.models.SymmetricKey.create({
            key_name: 'Symmetric Key for DB Backup',
            key_value: key.toString('hex'),
            iv_value: iv.toString('hex')
        })

        return { message: 'A chave simétrica foi gerada e salva!' }
    }



    private createFilePath(subfolder: string, fileName: string, ext: string) {
        const date = format(new Date(), 'dd-MM-yyyy')
        return path.join(__dirname, '../secure/keys', subfolder, `${fileName}-${date}.${ext}`)
    }
}



export default SecurityKeyService