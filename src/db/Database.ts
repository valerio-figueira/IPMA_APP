import { QueryTypes, Sequelize } from "sequelize";
import DB_Config, { DB_ConfigType } from "./DatabaseConfig";
import { DBErrors as ERROR } from "../utils/errors/Errors";
import * as dotenv from "dotenv";
import Models from "../models";
import { exec } from "child_process";
import * as path from "path";
import { format } from "date-fns";
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

            const dumpCommand = this.createDumpCommand()

            // Executa o comando mysqldump usando child_process
            await new Promise((resolve, reject) => {
                exec(dumpCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erro ao fazer backup do banco de dados: ${stderr}`)
                        reject(error)
                    } else {
                        console.log(`Backup do banco de dados realizado com sucesso. Saída: ${stdout}`)
                        resolve(true)
                    }
                })
            })
        } catch (error: any) {
            throw new Error(`Erro ao fazer backup do banco de dados: ${error.message}`)
        }
    }




    private createDumpCommand() {
        const user = this.config.username
        const host = this.config.host
        const port = this.config.port
        const dbname = this.config.database
        const path = this.createFilePath()
        return `mysqldump -u ${user} -p${this.config.password} -h ${host} --port ${port || ''} ${dbname} > ${path}`
    }




    private createFilePath() {
        const currentTime = format(new Date(), 'dd-MM-yyyy')
        const fileName = `backup-database-${currentTime}.sql`
        const filePath = path.join(__dirname, '../backup', fileName)
        console.log(filePath)
        return filePath
    }
}