import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import { IHolderBase } from '../interfaces/IHolder';

const db = new Database;


class HolderModel extends Model<IHolderBase> {
    holder_id!: number;
    user_id!: number;
    registration_number?: number | null;
    status!: 'Ativo' | 'Aposentado' | 'Licença';
}


HolderModel.init(
    {
        holder_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
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
        registration_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM('Ativo', 'Aposentado', 'Licença'),
            allowNull: false,
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'HOLDER',
        modelName: 'HolderModel',
        timestamps: false,
    }
);

export default HolderModel;