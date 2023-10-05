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
    created_at!: Date;
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
            defaultValue: null
        },
        health_card: {
            type: DataTypes.STRING(15),
            defaultValue: null
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        }
    },
    {
        sequelize: db.sequelize,
        tableName: 'DOCUMENT',
        modelName: 'DocumentModel',
        timestamps: false,
    }
);

export default DocumentModel;