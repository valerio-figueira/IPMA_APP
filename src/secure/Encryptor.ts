import crypto from 'crypto';
import format from 'date-fns/format';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process'


class Encryptor {

    constructor() { }

    static encryptSQLBackup(backupPath: string) {
        const date = format(new Date(), 'dd-MM-yyyy')
        const backup = fs.createReadStream(backupPath)
        const encryptedBackupPath = path.join(__dirname, '../backup', `backup-database-${date}.bin`)
        const encryptedBackupOutput = fs.createWriteStream(encryptedBackupPath)

        const { key, iv } = this.readKeys(date)

        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)

        backup.pipe(cipher).pipe(encryptedBackupOutput)

        encryptedBackupOutput.on('finish', () => {
            console.log('Cifragem concluída. O arquivo foi criptografado e salvo!')
            encryptedBackupOutput.end()
        })

        encryptedBackupOutput.on('error', (err: Error) => {
            throw new Error(err.message)
        })
    }




    static decryptSQLBackup(encryptedBackupPath: string, decryptedBackupPath: string) {
        const inputStream = fs.createReadStream(encryptedBackupPath);
        const outputStream = fs.createWriteStream(decryptedBackupPath);
        const decipher = crypto.createDecipheriv('aes-256-cbc', 'key', 'iv');

        inputStream.pipe(decipher).pipe(outputStream);

        return new Promise((resolve, reject) => {
            outputStream.on('finish', () => {
                const message = 'Decifragem concluída. O arquivo foi descriptografado e salvo!'
                console.log(message)
                resolve(message)
            })

            outputStream.on('error', (err) => reject(err))
        })
    }




    static async createGpgEncryption(filePath: string, fileName: string) {
        // Comando para criptografar o arquivo de backup usando gpg
        const pb_key = process.env.PUBLIC_KEY
        if (!pb_key) throw new Error('Está faltando a chave pública!')

        const gpgCommand = `gpg --debug lookup --output ${filePath}.gpg --encrypt --recipient ${pb_key} ${filePath}`

        this.fileExists(filePath + '.gpg')

        await this.runCommand(gpgCommand,
            'Backup criptografado com sucesso!',
            'Erro ao criptografar o backup!')

        // Remova o arquivo de backup não criptografado
        fs.unlinkSync(filePath)
        return { encryptedFilePath: `${filePath}.gpg`, encryptedFileName: `${fileName}.gpg` }
    }




    private static readKeys(date: string) {
        const keyName = `symmetric-key-${date}.bin`
        const ivName = `iv-key-${date}.bin`

        const keyPath = path.join(__dirname, 'keys', 'symmetric', keyName)
        const ivPath = path.join(__dirname, 'keys', 'symmetric', ivName)

        return {
            key: fs.readFileSync(keyPath),
            iv: fs.readFileSync(ivPath)
        }
    }




    private static fileExists(filePath: string) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) fs.unlinkSync(filePath)
        })
    }




    private static async runCommand(command: string, successMessage: string,
        errorMessage: string | null = null): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`${errorMessage || 'Erro durante o comando.'} Saída: ${stderr}`);
                    reject(error)
                } else {
                    console.log(`${successMessage}`);
                    resolve()
                }
            })
        })
    }
}



export default Encryptor