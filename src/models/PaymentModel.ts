import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import IPayment from '../interfaces/IPayments';
import InstallmentModel from './InstallmentModel';


class PaymentModel extends Model<IPayment> {
    declare payment_id: number;
    declare installment_id: number;
    declare paid_amount: number;
    declare transaction_date: number;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<PaymentModel> {
        super.init({
            payment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            installment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: InstallmentModel,
                    key: 'installment_id',
                }
            },
            paid_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            installment_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            transaction_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'PAYMENT',
            modelName: 'PaymentModel',
            timestamps: false,
        })


        InstallmentModel.hasOne(this, {
            as: 'payment',
            foreignKey: 'installment_id'
        })

        this.belongsTo(InstallmentModel, {
            as: 'installment',
            foreignKey: 'installment_id'
        })


        return this
    }
}


export default PaymentModel;