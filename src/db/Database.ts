import { QueryTypes, Sequelize } from "sequelize";
import DB_Config, { DB_ConfigType } from "./DatabaseConfig";
import { DBErrors as ERROR } from "../utils/errors/Errors";
import * as dotenv from "dotenv";
import Models from "../models";
import { exec } from "child_process";
import * as path from "path";
import * as fs from "fs";
import { format } from "date-fns";
import { UploadedFile } from "express-fileupload";
dotenv.config();

type envProps = undefined | 'test' | 'development' | 'production'

export default class Database {
    private environment
    private config: DB_ConfigType
    sequelize: Sequelize
    models: Models

    constructor() {
        const DB_ENV = process.env.DB_ENV as envProps
        this.environment = DB_ENV || 'test'
        this.config = DB_Config[this.environment]
        this.sequelize = this.createSequelizeInstance()
        this.models = new Models(this.sequelize)
    }





    private createSequelizeInstance() {
        return new Sequelize(
            this.config.database,
            this.config.username,
            this.config.password, {
            host: this.config.host,
            port: null || this.config.port,
            dialect: this.config.dialect,
            define: {
                charset: 'utf8mb4',
                collate: 'utf8mb4_unicode_ci',
                timestamps: true
            }
        })
    }





    async authenticate() {
        try {
            await this.sequelize.authenticate();
            console.log('Conexão com o banco de dados estabelecida com sucesso.');
        } catch (error: any) {
            throw ERROR.DBAuthError
        }
    }





    async syncModels() {
        try {
            await this.authenticate()
            new Models(this.sequelize)
            await this.sequelize.sync()
        } catch (error: any) {
            throw ERROR.DBSyncError
        }
    }





    async clearDatabase() {
        try {
            if (this.environment !== 'test') throw Error('Não é o ambiente de teste!')

            await this.authenticate()
            await this.sequelize.sync({ force: true })
            console.log('Banco de dados limpo com sucesso.')
        } catch (error: any) {
            throw ERROR.ClearDBError + ': ' + error.message
        }
    }





    async startTransaction() {
        return this.sequelize.transaction();
    }





    async commitTransaction(transaction: any) {
        if (transaction) {
            await transaction.commit();
        }
    }





    async rollbackTransaction(transaction: any) {
        if (transaction) {
            await transaction.rollback();
        }
    }





    async createIndex(tableName: string, indexName: string, columns: string[]) {
        const sql = `CREATE INDEX ${indexName} ON ${tableName} (${columns.join(', ')})`;
        await this.sequelize.query(sql, { type: QueryTypes.RAW });
    }





    async updateIndex(tableName: string, indexName: string, newColumns: string[]) {
        // Para atualizar um índice, você pode criar um novo índice e, em seguida, excluir o antigo
        await this.createIndex(tableName, `new_${indexName}`, newColumns);
        await this.dropIndex(tableName, indexName);
    }





    async dropIndex(tableName: string, indexName: string) {
        const sql = `DROP INDEX ${indexName} ON ${tableName}`;
        await this.sequelize.query(sql, { type: QueryTypes.RAW });
    }





    async backupDatabase() {
        try {
            if (this.environment !== 'development') {
                throw new Error('Não é possível fazer backup em um ambiente que não seja de desenvolvimento.')
            }

            await this.authenticate()

            const { filePath, fileName } = this.createFilePath('../backup')
            const dumpCommand = this.createDumpCommand(filePath)

            // Executa o comando mysqldump usando child_process
            await this.runCommand(dumpCommand,
                'Backup do banco de dados realizado com sucesso!',
                'Erro ao fazer backup do banco de dados')

            const { encryptedFilePath, encryptedFileName } = await this.encryptBackup(filePath, fileName)

            return { readStream: fs.createReadStream(encryptedFilePath), encryptedFileName }
        } catch (error: any) {
            throw new Error(`Erro ao fazer backup do banco de dados: ${error.message}`)
        }
    }





    private async encryptBackup(filePath: string, fileName: string) {
        // Comando para criptografar o arquivo de backup usando gpg
        const email = 'j.valerio.figueira@gmail.com'
        const gpgCommand = `gpg --output ${filePath}.gpg --encrypt --recipient ${email} ${filePath}`

        this.fileExists(filePath + '.gpg')

        await this.runCommand(gpgCommand,
            'Backup criptografado com sucesso!',
            'Erro ao criptografar o backup!')

        // Remova o arquivo de backup não criptografado
        fs.unlinkSync(filePath)
        return { encryptedFilePath: `${filePath}.gpg`, encryptedFileName: `${fileName}.gpg` }
    }





    async decryptBackup(encryptedFile: UploadedFile) {
        try {
            const encryptedTempFilePath = path.join(__dirname, '../temp', encryptedFile.name)

            await this.moveUploadedFile(encryptedFile, encryptedTempFilePath)

            const { filePath } = this.createFilePath('../temp')
            const privateKeyFilePath = path.join(__dirname, '../certificates', 'secret-key.gpg')
            const importPrivateKeyCommand = `gpg --import ${privateKeyFilePath}`
            await this.runCommand(importPrivateKeyCommand, 'Chave privada foi importada com sucesso!')

            // Comando para descriptografar usando gpg
            const decryptCommand = `gpg --output ${filePath} --decrypt ${encryptedTempFilePath}`

            await this.runCommand(decryptCommand, 'O backup foi descriptografado com sucesso!')
            fs.unlinkSync(encryptedTempFilePath)

            return { readStream: fs.createReadStream(filePath), filePath }
        } catch (error: any) {
            throw new Error(`Erro ao descriptografar o backup: ${error.message}`)
        }
    }





    async restoreBackup(file: UploadedFile): Promise<Record<string, string>> {
        return new Promise(async (resolve, reject) => {
            const tempFilePath = path.join(__dirname, '../temp', file.name)

            await this.moveUploadedFile(file, tempFilePath)

            const { command, cnfFilePath } = this.createRestoreCommand(tempFilePath)

            const restoreProcess = exec(command, (error, stdout, stderr) => {
                fs.unlinkSync(cnfFilePath)
                if (error) {
                    console.error(`Erro ao restaurar o backup: ${stderr}`)
                    reject(error)
                } else {
                    console.log(`Backup restaurado com sucesso. Saída: ${stdout}`)
                    fs.unlinkSync(tempFilePath)
                    resolve({ message: 'Backup restaurado com sucesso' })
                }
            })

            if (restoreProcess.stdout) {
                restoreProcess.stdout.on('data', (data) => console.log(`Progresso da restauração: ${data}`))
            }
            if (restoreProcess.stderr) {
                restoreProcess.stderr.on('data', (data) => console.error(`Erro durante a restauração: ${data}`))
            }
        })
    }





    private async runCommand(command: string, successMessage: string,
        errorMessage: string | null = null): Promise<void> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`${errorMessage || 'Erro durante o comando.'} Saída: ${stderr}`);
                    reject(error)
                } else {
                    console.log(`${successMessage} Saída: ${stdout}`);
                    resolve()
                }
            })
        })
    }




    private createDumpCommand(filePath: string) {
        const user = this.config.username
        const host = this.config.host
        const port = this.config.port
        const dbname = this.config.database
        return `mysqldump -u ${user} -p${this.config.password} -h ${host} --port ${port || ''} ${dbname} > ${filePath}`
    }





    private createRestoreCommand(backupFilePath: string) {
        const user = this.config.username
        const host = this.config.host
        const port = this.config.port
        const dbname = this.config.database

        // `mysql -h ${host} -P ${port || ''} -u ${user} -p${this.config.password} ${dbname} < ${backupFilePath}`
        // Cria um arquivo my.cnf temporário com as credenciais
        const cnfContents = `[client]\nuser=${user}\npassword=${this.config.password}\nhost=${host}\nport=${port}`
        const cnfFilePath = path.join(__dirname, '../temp', 'db.cnf')
        fs.writeFileSync(cnfFilePath, cnfContents)
        const command = `mysql --defaults-file=${cnfFilePath} ${dbname} < ${backupFilePath}`

        return { command, cnfFilePath }
    }






    private fileExists(filePath: string) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (!err) fs.unlinkSync(filePath)
        })
    }





    private moveUploadedFile(encryptedFile: UploadedFile, tempFilePath: string) {
        return new Promise<void>((resolve, reject) => {
            encryptedFile.mv(tempFilePath, (err) => {
                if (err) reject(err)
                else resolve()
            })
        })
    }





    private createFilePath(relativePath: string) {
        const currentTime = format(new Date(), 'dd-MM-yyyy')
        const fileName = `backup-database-${currentTime}.sql`
        const filePath = path.join(__dirname, relativePath, fileName)
        return { fileName, filePath }
    }
}