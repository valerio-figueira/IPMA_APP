import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import HolderModel from './HolderModel';
import DependentModel from './DependentModel';
import AgreementModel from './AgreementModel';
import IMember from '../interfaces/IMember';
import MonthlyFeeModel from './MonthlyFeeModel';


class MemberModel extends Model<IMember> {
    declare member_id: number;
    declare holder_id: number;
    declare dependent_id?: number | null;
    declare agreement_id: number;
    declare agreement_card?: number | null;
    declare active: boolean;
    declare created_at: Date;
    declare exclusion_date?: Date | null;
    declare agreement?: AgreementModel;
    declare dependent?: DependentModel;
    declare holder?: HolderModel;
    declare billing?: MonthlyFeeModel;

    static INIT(sequelize: Sequelize): ModelStatic<MemberModel> {
        super.init({
            member_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            holder_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: HolderModel,
                    key: 'holder_id',
                }
            },
            dependent_id: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                allowNull: true,
                references: {
                    model: DependentModel,
                    key: 'dependent_id',
                }
            },
            agreement_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: AgreementModel,
                    key: 'agreement_id'
                }
            },
            agreement_card: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
            exclusion_date: {
                type: DataTypes.DATE,
                defaultValue: null
            },
        }, {
            sequelize,
            tableName: 'MEMBER',
            modelName: 'MemberModel',
            timestamps: false,
        })



        HolderModel.hasOne(this, {
            foreignKey: 'holder_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        })

        this.belongsTo(HolderModel, {
            foreignKey: 'holder_id',
            as: 'holder'
        })

        AgreementModel.hasOne(this, {
            foreignKey: 'agreement_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        })

        this.belongsTo(AgreementModel, {
            foreignKey: 'agreement_id',
            as: 'agreement'
        })

        DependentModel.hasOne(this, {
            foreignKey: 'dependent_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        })

        this.belongsTo(DependentModel, {
            foreignKey: 'dependent_id',
            as: 'dependent',
        })

        return this
    }
}


export default MemberModel;