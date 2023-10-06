import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import { IHolderBase } from '../interfaces/IHolder';
import { IUser } from '../interfaces/IUser';

const db = new Database;


class HolderModel extends Model<IHolderBase> {
    holder_id!: number;
    user_id!: number;
    subscription_number?: number | null;
    status!: 'ATIVO(A)' | 'APOSENTADO(A)' | 'LICENÇA';
    created_at!: Date;
    user?: IUser
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
        subscription_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: null
        },
        status: {
            type: DataTypes.ENUM('Ativo', 'Aposentado', 'Licença'),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    },
    {
        sequelize: db.sequelize,
        tableName: 'HOLDER',
        modelName: 'HolderModel',
        timestamps: false,
    }
);

export default HolderModel;