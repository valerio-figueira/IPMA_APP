import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export default class Database {
    sequelize: Sequelize

    constructor() {
        this.sequelize = new Sequelize(
            process.env.DB_DATABASE || 'database', 
            process.env.DB_USERNAME || 'username', 
            process.env.DB_PASSWORD || 'password', {
            host: process.env.DB_HOST || 'localhost',
            dialect: 'mysql',
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