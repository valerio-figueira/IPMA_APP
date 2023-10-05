import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IMonthlyFee from '../interfaces/IMonthlyFee';
import MemberModel from './MemberModel';

const db = new Database;


class MonthlyFeeModel extends Model<IMonthlyFee> {
    monthly_fee_id!: number;
    member_id!: number;
    amount!: number;
    reference_month!: number;
    reference_year!: number;
    status!: 'Pendente' | 'Pago' | 'Anulado';
    reference_date!: Date;
    payment_date?: Date;
    created_at!: Date;
}

MonthlyFeeModel.init(
    {
        monthly_fee_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        member_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: MemberModel,
                key: 'member_id',
            }
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        reference_month: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 12,
            },
        },
        reference_year: {
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
        reference_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        payment_date: {
            type: DataTypes.DATE,
            allowNull: true,
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
        modelName: 'MonthlyFeeModel',
        tableName: 'MONTHLY_FEE',
        timestamps: false, // Define como false se você não quiser usar colunas de timestamp created_at e updated_at
    }
);

MonthlyFeeModel.belongsTo(MemberModel, {
    foreignKey: 'member_id',
    as: 'subscription'
})

MemberModel.hasMany(MonthlyFeeModel, {
    foreignKey: 'member_id',
    as: 'billing'
})


export default MonthlyFeeModel;