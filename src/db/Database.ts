import { Sequelize } from "sequelize";
import DB_Config from "./DatabaseConfig";
import dotenv from "dotenv";
import Models from "../models";
dotenv.config();

type envProps = 'development' | 'test' | 'production'

export default class Database {
    sequelize: Sequelize

    constructor() {
        const envTest = process.env.NODE_ENV as envProps
        const environment: envProps = envTest || 'production'
        const config = DB_Config[environment]

        this.sequelize = new Sequelize(
            config.database,
            config.username,
            config.password, {
            host: config.host,
            port: null || config.port,
            dialect: config.dialect,
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
        } catch (error) {
            console.error('Erro ao conectar ao banco de dados:', error);
        }
    }

    async syncModels() {
        try {
            return new Models(this.sequelize)
        } catch (error) {
            console.error('Erro ao sincronizar modelos com o banco de dados:', error);
        }
    }

    async clearDatabase() {
        try {
            await this.authenticate()
            await this.sequelize.sync({ force: true })
            console.log('Banco de dados limpo com sucesso.');
        } catch (error) {
            console.error('Erro ao limpar o banco de dados:', error);
        }
    }
}