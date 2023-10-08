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
    gender!: 'Masculino' | 'Feminino' | 'Outro';
    marital_status?: string | null;
    birth_date?: Date | null;
    father_name?: string | null;
    mother_name?: string | null;
    created_at!: Date;
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
            type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'),
        },
        marital_status: {
            type: DataTypes.STRING(10),
            defaultValue: null
        },
        birth_date: {
            type: DataTypes.DATE,
            defaultValue: null
        },
        father_name: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        mother_name: {
            type: DataTypes.STRING(50),
            defaultValue: null
        },
        created_at: {
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
DocumentModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});
LocationModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});
ContactModel.belongsTo(UserModel, {
    foreignKey: 'user_id'
});


export default UserModel