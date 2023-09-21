import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IBusinessContract from '../interfaces/IBusinessContract';

const db = new Database;


class BusinessContractModel extends Model<IBusinessContract> {
    id_convenio!: number;
    nome_convenio!: string;
    descricao?: string | null;
    data_registro!: Date;
}


BusinessContractModel.init(
    {
        id_convenio: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nome_convenio: {
            type: DataTypes.STRING(20),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        data_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'CONVENIO',
        modelName: 'BusinessContractModel',
        timestamps: false, // Defina como true se desejar timestamps automáticos
    }
);


export default BusinessContractModel;