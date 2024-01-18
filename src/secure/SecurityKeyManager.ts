import * as crypto from 'crypto';
import * as fs from 'fs';


class SecurityKeyManager {
    private asymmetricKeySize: number;
    private symmetricKeySize: number;


    constructor(asymmetricKeySize: number = 4096, symmetricKeySize: number = 32) {
        this.asymmetricKeySize = asymmetricKeySize
        this.symmetricKeySize = symmetricKeySize
    }




    // Gera um par de chaves RSA (pública e privada) para criptografia assimétrica
    public generateRSAKeys(): { publicKey: string; privateKey: string } {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: this.asymmetricKeySize,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        })

        return { publicKey, privateKey }
    }




    // Gera uma chave simétrica para criptografia simétrica
    public generateSymmetricKey(): Record<string, Buffer> {
        const key = crypto.randomBytes(this.symmetricKeySize)
        const iv = crypto.randomBytes(16)

        return { key, iv }
    }




    // Salva a chave pública RSA em um arquivo
    public saveRSAPublicKeyToFile(publicKey: string, fileName: string): void {
        fs.writeFileSync(fileName, publicKey)
    }




    // Salva a chave privada RSA em um arquivo
    public saveRSAPrivateKeyToFile(privateKey: string, fileName: string): void {
        fs.writeFileSync(fileName, privateKey)
    }




    // Salva uma chave simétrica em um arquivo
    public saveSymmetricKeyToFile(key: Buffer, fileName: string): void {
        fs.writeFileSync(fileName, key)
    }
}


export default SecurityKeyManager