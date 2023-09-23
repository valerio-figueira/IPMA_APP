import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IBilling from '../interfaces/IBilling';
import ContractRegistryModel from './ContractRegistryModel';

const db = new Database;


class BillingModel extends Model<IBilling> { }

BillingModel.init(
    {
        id_mensalidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        id_conveniado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: ContractRegistryModel,
                key: 'id_conveniado',
            }
        },
        valor: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        mes_referencia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12,
            },
        },
        ano_referencia: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2015,
                max: 2100,
            },
        },
        status: {
            type: DataTypes.ENUM('Pendente', 'Pago', 'Anulado'),
            allowNull: false,
            defaultValue: 'Pendente',
        },
        data_referencia: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        data_pagamento: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        data_registro: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
    },
    {
        sequelize: db.sequelize,
        modelName: 'BillingModel',
        tableName: 'MENSALIDADE',
        timestamps: false, // Define como false se você não quiser usar colunas de timestamp created_at e updated_at
    }
);

BillingModel.belongsTo(ContractRegistryModel, {
    foreignKey: 'id_conveniado',
    as: 'subscription'
})

ContractRegistryModel.hasMany(BillingModel, {
    foreignKey: 'id_conveniado',
    as: 'billing'
})


export default BillingModel;