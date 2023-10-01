import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IAgreement from '../interfaces/IAgreement';

const db = new Database;


class AgreementModel extends Model<IAgreement> {
    agreement_id!: number;
    agreement_name!: string;
    description!: string | null;
    registration_date!: Date;
}


AgreementModel.init(
    {
        agreement_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        agreement_name: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        registration_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'AGREEMENT',
        modelName: 'AgreementModel',
        timestamps: false, // Defina como true se desejar timestamps automáticos
    }
);


export default AgreementModel;