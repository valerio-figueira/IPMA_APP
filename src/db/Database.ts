import { Sequelize } from "sequelize";
import DB_Config from "./DatabaseConfig";
import dotenv from "dotenv";
dotenv.config();

type envProps = 'test' | 'production'

export default class Database {
    sequelize: Sequelize

    constructor() {
        const envTest = process.env.NODE_ENV as undefined | 'test'
        const environment: envProps = envTest || 'production'
        const config = DB_Config[environment]

        this.sequelize = new Sequelize(
            config.username,
            config.password,
            config.database, {
            host: config.host,
            dialect: config.dialect,
            storage: null || config.storage
        });
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
            console.log('Modelos sincronizados com o banco de dados.');
        } catch (error) {
            console.error('Erro ao sincronizar modelos com o banco de dados:', error);
        }
    }
}