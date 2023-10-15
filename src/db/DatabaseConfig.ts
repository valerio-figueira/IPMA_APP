import { Dialect } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

type DB_Props = {
    username: string,
    password: string,
    database: string,
    host: string,
    dialect: Dialect,
    storage?: string
}

export type DB_ConfigProps = { production: DB_Props, test: DB_Props }

const DB_Config: DB_ConfigProps = {
    production: {
        username: process.env.DB_USERNAME || 'username',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'database',
        host: process.env.DB_HOST || 'host',
        dialect: 'mysql',
    },
    test: {
        username: 'root',
        password: 'root',
        database: 'SOCIAL_SECURITY',
        host: '172.17.0.2',
        dialect: 'sqlite',
        storage: ':memory:',
    },
};

export default DB_Config