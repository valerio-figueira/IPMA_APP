import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import HolderModel from './HolderModel';
import DependentModel from './DependentModel';
import BusinessContractModel from './BusinessContractModel';
import IMemberModel from '../interfaces/IMemberModel';

const db = new Database;


class MemberModel extends Model<IMemberModel> {
    id_conveniado!: number;
    id_titular!: number;
    id_dependente?: number;
    id_convenio!: number;
    ativo!: boolean;
    data_registro!: Date;
    data_exclusao?: Date;
}


MemberModel.init(
    {
        id_conveniado: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_titular: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        id_dependente: {
            type: DataTypes.INTEGER,
        },
        id_convenio: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ativo: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        data_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        data_exclusao: {
            type: DataTypes.DATE
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'CONVENIADO',
        modelName: 'MemberModel',
        timestamps: false,
    }
);

MemberModel.belongsTo(HolderModel, {
    foreignKey: 'id_titular',
    as: 'holder'
});

MemberModel.belongsTo(DependentModel, {
    foreignKey: 'id_dependente',
    as: 'dependent'
});

MemberModel.belongsTo(BusinessContractModel, {
    foreignKey: 'id_convenio',
    as: 'convenio'
});

DependentModel.hasMany(MemberModel, {
    foreignKey: 'id_dependente'
})

BusinessContractModel.hasMany(MemberModel, {
    foreignKey: 'id_convenio'
})

export default MemberModel;