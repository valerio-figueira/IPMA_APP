import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import { IHolderBase } from '../interfaces/IHolder';

const db = new Database;


class HolderModel extends Model<IHolderBase> {
    id_titular!: number;
    id_usuario!: number;
    matricula!: number | null;
    status!: 'Ativo' | 'Aposentado' | 'LIP';
}


HolderModel.init(
    {
        id_titular: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        matricula: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('Ativo', 'Aposentado', 'LIP'),
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'TITULAR',
        modelName: 'HolderModel',
        timestamps: false,
    }
);

export default HolderModel;