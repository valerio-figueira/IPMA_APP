import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';
import { IDocument } from '../../interfaces/IUser';

const db = new Database;

class DocumentModel extends Model<IDocument> {
    document_id!: number;
    user_id!: number;
    cpf!: string;
    identity!: string;
    issue_date?: Date | null;
    health_card?: string | null;
}


DocumentModel.init(
    {
        document_id: {
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
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            unique: true,
        },
        identity: {
            type: DataTypes.STRING(10),
            allowNull: false,
            unique: true,
        },
        issue_date: {
            type: DataTypes.DATE,
        },
        health_card: {
            type: DataTypes.STRING(15),
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'DOCUMENT',
        modelName: 'DocumentModel',
        timestamps: false,
    }
);

export default DocumentModel;