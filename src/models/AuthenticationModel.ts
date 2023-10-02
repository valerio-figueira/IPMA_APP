import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IAuthentication from '../interfaces/IAuthentication';
import UserModel from './user/UserModel';
import AccessHierarchyModel from './AccessHierarchyModel';

const db = new Database;

class AuthenticationModel extends Model<IAuthentication> {
    authentication_id!: number;
    user_id!: number;
    hierarchy_id!: number;
    username!: string;
    password!: string;
    user_photo?: string | null;
}

AuthenticationModel.init(
    {
        authentication_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: UserModel,
                key: 'user_id',
            },
        },
        hierarchy_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        user_photo: {
            type: DataTypes.STRING(50),
            defaultValue: null
        }
    },
    {
        sequelize: db.sequelize,
        modelName: 'AuthenticationModel',
        tableName: 'AUTHENTICATION',
        timestamps: false
    }
);

UserModel.hasOne(AuthenticationModel, {
    foreignKey: 'user_id',
    as: 'authentication'
})

AuthenticationModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
})

AuthenticationModel.belongsTo(AccessHierarchyModel, {
    foreignKey: 'hierarchy_id',
    as: 'accessHierarchy',
});

export default AuthenticationModel