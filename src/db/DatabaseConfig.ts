import { Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

type DB_Props = {
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: Dialect,
    storage?: string,
    port?: number
}

const DB_Config: Record<string, DB_Props> = {
    development: {
        username: 'root',
        password: 'root',
        database: 'SOCIAL_SECURITY_DEV',
        host: '172.17.0.2',
        dialect: 'mysql',
        port: 3306
    },
    test: {
        username: 'root',
        password: 'root',
        database: 'SOCIAL_SECURITY_TEST',
        host: '172.17.0.2',
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