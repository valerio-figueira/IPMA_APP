import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import HolderModel from './HolderModel';
import DependentModel from './DependentModel';
import AgreementModel from './AgreementModel';
import IMember from '../interfaces/IMember';

const db = new Database;


class MemberModel extends Model<IMember> {
    member_id!: number;
    holder_id!: number;
    dependent_id?: number | null;
    agreement_id!: number;
    agreement_card?: number | null;
    active!: boolean;
    created_at!: Date;
    exclusion_date?: Date | null;
    agreement?: AgreementModel
}


MemberModel.init(
    {
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
            defaultValue: null
        },
        agreement_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: AgreementModel,
                key: 'agreement_id',
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
    },
    {
        sequelize: db.sequelize,
        tableName: 'MEMBER',
        modelName: 'MemberModel',
        timestamps: false,
    }
);

MemberModel.belongsTo(HolderModel, {
    foreignKey: 'holder_id',
    as: 'holder'
});

MemberModel.belongsTo(DependentModel, {
    foreignKey: 'dependent_id',
    as: 'dependent'
});

MemberModel.belongsTo(AgreementModel, {
    foreignKey: 'agreement_id',
    as: 'agreement'
});

HolderModel.hasMany(MemberModel, {
    foreignKey: 'holder_id',
    as: 'subscription'
});

DependentModel.hasMany(MemberModel, {
    foreignKey: 'dependent_id'
})

AgreementModel.hasMany(MemberModel, {
    foreignKey: 'agreement_id',
    as: 'subscription'
})

export default MemberModel;