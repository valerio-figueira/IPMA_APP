import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import UserModel from './UserModel';
import { IDocument } from '../../interfaces/IUser';
import { TDocumentModel } from '../../types/TModels';


class DocumentModel extends Model<IDocument> {
    declare document_id: number;
    declare user_id: number;
    declare cpf: string;
    declare identity: string;
    declare issue_date?: Date | null;
    declare health_card?: string | null;
    declare created_at: Date;

    static INIT(sequelize: any)
    : ModelStatic<DocumentModel> {
        super.init({
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
                type: DataTypes.STRING(14),
                allowNull: false,
                unique: true,
            },
            identity: {
                type: DataTypes.STRING(10),
                allowNull: true,
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
        }, {
            sequelize,
            tableName: 'DOCUMENT',
            modelName: 'DocumentModel',
            timestamps: false,
        })

        return sequelize.models.DocumentModel
    }
}


export default DocumentModel;