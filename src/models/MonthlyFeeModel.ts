import { Model, DataTypes, ModelStatic } from 'sequelize';
import IMonthlyFee from '../interfaces/IMonthlyFee';
import MemberModel from './MemberModel';
import { TMonthlyFeeModel } from '../types/TModels';


class MonthlyFeeModel extends Model<IMonthlyFee> {
    declare monthly_fee_id: number;
    declare member_id: number;
    declare amount: number;
    declare reference_month: number;
    declare reference_year: number;
    declare status: 'PENDENTE' | 'PAGO' | 'ANULADO';
    declare reference_date: Date;
    declare payment_date?: Date;
    declare created_at: Date;

    static INIT(sequelize: any): ModelStatic<MonthlyFeeModel> {
        super.init({
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
                type: DataTypes.ENUM('PENDENTE', 'PAGO', 'ANULADO'),
                allowNull: false,
                defaultValue: 'PENDENTE',
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
        }, {
            sequelize,
            modelName: 'MonthlyFeeModel',
            tableName: 'MONTHLY_FEE',
            timestamps: false, // Define como false se você não quiser usar colunas de timestamp created_at e updated_at
        })

        const monthlyFeeModel = sequelize.models.MonthlyFeeModel

        this.createAssociations(monthlyFeeModel)

        return monthlyFeeModel
    }

    static createAssociations(MonthlyFeeModel: TMonthlyFeeModel) {
        MonthlyFeeModel.belongsTo(MemberModel, {
            foreignKey: 'member_id',
            as: 'subscription'
        })

        MemberModel.hasMany(MonthlyFeeModel, {
            foreignKey: 'member_id',
            as: 'billing',
            onDelete: 'CASCADE'
        })
    }
}


export default MonthlyFeeModel;