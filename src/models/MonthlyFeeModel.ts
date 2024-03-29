import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import IMonthlyFee from '../interfaces/IMonthlyFee';
import MemberModel from './MemberModel';


class MonthlyFeeModel extends Model<IMonthlyFee> {
    declare monthly_fee_id: number;
    declare member_id: number;
    declare amount: number;
    declare reference_month: number;
    declare reference_year: number;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<MonthlyFeeModel> {
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
            created_at: {
                type: DataTypes.DATE,
                defaultValue: Sequelize.fn('NOW'),
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'MonthlyFeeModel',
            tableName: 'MONTHLY_FEE',
            timestamps: false, // Define como false se você não quiser usar colunas de timestamp created_at e updated_at
        })

        MemberModel.hasOne(this, {
            foreignKey: 'member_id',
            as: 'billing',
            onDelete: 'CASCADE'
        })

        this.belongsTo(MemberModel, {
            foreignKey: 'member_id',
            as: 'subscription'
        })

        return this
    }
}


export default MonthlyFeeModel;