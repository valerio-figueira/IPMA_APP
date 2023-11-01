import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import HolderModel from './HolderModel';
import DependentModel from './DependentModel';
import AgreementModel from './AgreementModel';
import IMember from '../interfaces/IMember';
import { TMemberModel } from '../types/TModels';
import sequelize from 'sequelize';


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

    static INIT(sequelize: any): ModelStatic<MemberModel> {
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
                references: {
                    model: DependentModel,
                    key: 'dependent_id',
                }
            },
            agreement_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
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

        const memberModel = sequelize.models.MemberModel
        this.createAssociations(memberModel, sequelize)

        return memberModel
    }

    private static createAssociations(MemberModel: TMemberModel, sequelize: Sequelize) {
        HolderModel.INIT(sequelize).hasOne(MemberModel, {
            foreignKey: 'holder_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        });

        MemberModel.belongsTo(HolderModel, {
            foreignKey: 'holder_id',
            as: 'holder'
        })

        AgreementModel.INIT(sequelize).hasOne(MemberModel, {
            foreignKey: 'agreement_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        })

        MemberModel.belongsTo(AgreementModel, {
            foreignKey: 'agreement_id',
            as: 'agreement'
        })

        DependentModel.INIT(sequelize).hasOne(MemberModel, {
            foreignKey: 'dependent_id',
            as: 'subscription',
            onDelete: 'CASCADE'
        })

        MemberModel.belongsTo(DependentModel, {
            foreignKey: 'dependent_id',
            as: 'dependent'
        })

    }
}


export default MemberModel;