import { Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export type DB_ConfigType = {
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: Dialect,
    storage?: string,
    port?: number
}

const DB_Config: Record<string, DB_ConfigType> = {
    development: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        host: process.env.DB_HOST as string,
        dialect: 'mysql',
        port: 3306
    },
    test: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        host: process.env.DB_HOST as string,
        dialect: 'mysql',
        port: 3306
    },
    production: {
        username: process.env.DB_USERNAME as string,
        password: process.env.DB_PASSWORD as string,
        database: process.env.DB_DATABASE as string,
        host: process.env.DB_HOST as string,
        dialect: 'mysql',
    },
};

export default DB_Config