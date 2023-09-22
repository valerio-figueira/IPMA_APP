import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';
import { IDocument } from '../../interfaces/IUser';

const db = new Database;

class DocumentModel extends Model<IDocument> {
    id_documento!: number;
    id_usuario!: number;
    cpf!: string;
    identidade!: string;
    data_expedicao?: Date | null;
    cartao_saude?: string | null;
}


DocumentModel.init(
    {
        id_documento: {
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
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true,
        },
        identidade: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        data_expedicao: {
            type: DataTypes.DATE,
        },
        cartao_saude: {
            type: DataTypes.STRING(15),
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'DOCUMENTO',
        modelName: 'DocumentModel',
        timestamps: false,
    }
);

export default DocumentModel;