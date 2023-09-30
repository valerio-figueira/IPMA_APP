import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IAuthentication from '../interfaces/IAuthentication';
import UserModel from './user/UserModel';

const db = new Database;

class AuthenticationModel extends Model<IAuthentication> {
    id_autenticacao!: number;
    id_usuario!: number;
    id_login!: string;
    senha_autenticacao!: string;
    foto_usuario?: string;
    grau_hierarquico?: 'SUPERUSUARIO' | 'ADMINISTRADOR' | 'USUARIO_COMUM';
}

AuthenticationModel.init(
    {
        id_autenticacao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: UserModel,
                key: 'id_usuario',
            },
        },
        id_login: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        senha_autenticacao: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        foto_usuario: {
            type: DataTypes.STRING(50),
        },
        grau_hierarquico: {
            type: DataTypes.ENUM('SUPERUSUARIO', 'ADMINISTRADOR', 'USUARIO_COMUM'),
        },
    },
    {
        sequelize: db.sequelize,
        modelName: 'AuthenticationModel',
        tableName: 'AUTENTICACAO',
        timestamps: false
    }
);

UserModel.hasOne(AuthenticationModel, {
    foreignKey: 'id_usuario',
    as: 'authentication'
})

AuthenticationModel.belongsTo(UserModel, {
    foreignKey: 'id_usuario'
})

export default AuthenticationModel