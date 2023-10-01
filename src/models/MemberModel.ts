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
    card_id?: number | null;
    active!: boolean;
    registration_date!: Date;
    exclusion_date?: Date | null;
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
        },
        agreement_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: AgreementModel,
                key: 'agreement_id',
            }
        },
        card_id: {
            type: DataTypes.INTEGER,
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        registration_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false,
        },
        exclusion_date: {
            type: DataTypes.DATE
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
    as: 'contract'
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
    as: 'contract'
})

export default MemberModel;