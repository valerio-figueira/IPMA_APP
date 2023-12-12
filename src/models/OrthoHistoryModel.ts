import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import IOrthoHistory from '../interfaces/IOrthoHistory';
import MemberModel from './MemberModel';


class OrthoHistoryModel extends Model<IOrthoHistory> {
    declare ortho_history_id: number;
    declare member_id: number;
    declare has_orthodontic_device: boolean;
    declare ortho_value: number;
    declare reference_month: number;
    declare reference_year: number;
    declare created_at: Date;
    subscription?: MemberModel

    static INIT(sequelize: Sequelize): ModelStatic<OrthoHistoryModel> {
        super.init({
            ortho_history_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            member_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            has_orthodontic_device: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            ortho_value: {
                type: DataTypes.DECIMAL(10, 2),
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
            tableName: 'ORTHO_HISTORY',
            modelName: 'OrthoHistoryModel',
            timestamps: false,
        })


        MemberModel.hasOne(this, {
            as: 'ortho_history',
            foreignKey: 'member_id'
        })

        this.belongsTo(MemberModel, {
            as: 'subscription',
            foreignKey: 'member_id'
        })


        return this
    }
}


export default OrthoHistoryModel;