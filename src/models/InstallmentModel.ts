import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import IInstallment from '../interfaces/IInstallment';
import MemberModel from './MemberModel';


class InstallmentModel extends Model<IInstallment> {
    declare installment_id: number;
    declare member_id: number;
    declare total_amount: number;
    declare installment_amount: number;
    declare installment_count: number;
    declare start_date: Date;
    declare reference_month: Date;
    declare reference_year: Date;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<InstallmentModel> {
        super.init({
            installment_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: MemberModel,
                    key: 'member_id',
                }
            },
            total_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            installment_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            installment_count: {
                type: DataTypes.INTEGER,
            },
            start_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            reference_month: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 12
                }
            },
            reference_year: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 2015
                }
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'INSTALLMENT',
            modelName: 'InstallmentModel',
            timestamps: false,
        })


        MemberModel.hasOne(this, {
            as: 'installment',
            foreignKey: 'member_id'
        })

        this.belongsTo(MemberModel, {
            as: 'subscription',
            foreignKey: 'member_id'
        })


        return this
    }
}


export default InstallmentModel;