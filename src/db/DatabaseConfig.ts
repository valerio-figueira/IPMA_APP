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

export type DB_ConfigProps = {
    development: DB_Props,
    test: DB_Props
    production: DB_Props,
}

const DB_Config: DB_ConfigProps = {
    development: {
        username: 'root',
        password: 'root',
        database: 'SOCIAL_SECURITY',
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
        username: process.env.DB_USERNAME || 'username',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'database',
        host: process.env.DB_HOST || 'host',
        dialect: 'mysql',
    },
};

export default DB_Config