import { Sequelize } from "sequelize";
import DB_Config from "./DatabaseConfig";
import dotenv from "dotenv";
dotenv.config();

type envProps = 'development' | 'test' | 'production'

export default class Database {
    sequelize: Sequelize

    constructor() {
        const envTest = process.env.NODE_ENV as undefined | 'test' | 'development'
        const environment: envProps = envTest || 'production'
        const config = DB_Config[environment]

        this.sequelize = new Sequelize(
            config.database,
            config.username,
            config.password, {
            host: config.host,
            port: null || config.port,
            dialect: config.dialect
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