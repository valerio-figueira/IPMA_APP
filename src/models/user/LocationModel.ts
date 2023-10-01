import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';
import { ILocation } from '../../interfaces/IUser';

const db = new Database;

class LocationModel extends Model<ILocation> {
    location_id!: number;
    user_id!: number;
    address?: string | null;
    number?: number | null;
    neighborhood?: string | null;
    city?: string | null;
    zipcode?: string | null
    state?: string | null;
}

LocationModel.init(
    {
        location_id: {
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
        address: {
            type: DataTypes.STRING(50),
        },
        number: {
            type: DataTypes.INTEGER,
        },
        neighborhood: {
            type: DataTypes.STRING(30),
        },
        city: {
            type: DataTypes.STRING(30),
        },
        zipcode: {
            type: DataTypes.STRING(10),
        },
        state: {
            type: DataTypes.STRING(2),
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'LOCATION',
        modelName: 'LocationModel',
        timestamps: false,
    }
);

export default LocationModel;