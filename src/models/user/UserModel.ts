import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import { IUser } from '../../interfaces/IUser';
import DocumentModel from './DocumentModel';
import ContactModel from './ContactModel';
import LocationModel from './LocationModel';

const db = new Database;

class UserModel extends Model<IUser> {
    id_usuario!: number;
    nome!: string;
    sexo!: 'Masculino' | 'Feminino' | 'Outro';
    estado_civil?: string;
    data_nasc?: Date;
    nome_pai?: string;
    nome_mae?: string;
    data_cadastro!: Date;
}

UserModel.init(
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        sexo: {
            type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'),
        },
        estado_civil: {
            type: DataTypes.STRING(10),
        },
        data_nasc: {
            type: DataTypes.DATE,
        },
        nome_pai: {
            type: DataTypes.STRING(50),
        },
        nome_mae: {
            type: DataTypes.STRING(50),
        },
        data_cadastro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'USUARIO',
        modelName: 'UserModel',
        timestamps: false,
    }
);

UserModel.hasOne(DocumentModel, {
    foreignKey: 'id_usuario'
})
UserModel.hasOne(ContactModel, {
    foreignKey: 'id_usuario'
})
UserModel.hasOne(LocationModel, {
    foreignKey: 'id_usuario'
})

DocumentModel.belongsTo(UserModel);
LocationModel.belongsTo(UserModel);
ContactModel.belongsTo(UserModel);

export default UserModel