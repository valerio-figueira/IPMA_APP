import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import { IUser } from '../../interfaces/IUser';
import DocumentModel from './DocumentModel';
import ContactModel from './ContactModel';
import LocationModel from './LocationModel';
import HolderModel from '../HolderModel';

const db = new Database;

class UserModel extends Model<IUser> {
    user_id!: number;
    name!: string;
    gender!: 'Male' | 'Female' | 'Other';
    marital_status?: string;
    birth_date?: Date;
    father_name?: string;
    mother_name?: string;
    registration_date!: Date;
}

UserModel.init(
    {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
        },
        marital_status: {
            type: DataTypes.STRING(10),
        },
        birth_date: {
            type: DataTypes.DATE,
        },
        father_name: {
            type: DataTypes.STRING(50),
        },
        mother_name: {
            type: DataTypes.STRING(50),
        },
        registration_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'USER',
        modelName: 'UserModel',
        timestamps: false,
    }
);

UserModel.hasOne(DocumentModel, {
    foreignKey: 'user_id',
    as: 'document'
})
UserModel.hasOne(ContactModel, {
    foreignKey: 'user_id',
    as: 'contact'
})
UserModel.hasOne(LocationModel, {
    foreignKey: 'user_id',
    as: 'location'
})
UserModel.hasOne(HolderModel, {
    foreignKey: 'user_id',
    as: 'holder'
})

DocumentModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});
LocationModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});
ContactModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});
HolderModel.belongsTo(UserModel, {
    foreignKey: 'user_id',
    as: 'user'
})

export default UserModel