import { QueryTypes, Sequelize } from "sequelize";
import DB_Config from "./DatabaseConfig";
import * as dotenv from "dotenv";
import Models from "../models";
import { DBErrors as ERROR } from "../utils/errors/Errors";
dotenv.config();

type envProps = undefined | 'test' | 'development' | 'production'

export default class Database {
    private environment
    private config
    sequelize: Sequelize

    constructor() {
        const DB_ENV = process.env.DB_ENV as envProps
        this.environment = DB_ENV || 'test'
        this.config = DB_Config[this.environment]

        this.sequelize = new Sequelize(
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
}