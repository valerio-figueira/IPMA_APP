import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import UserModel from './user/UserModel';
import { IHolderBase } from '../interfaces/IHolder';
import { UserNestedProps } from '../interfaces/IUser';
import IAuthentication from '../interfaces/IAuthentication';
import IMember from '../interfaces/IMember';
import DependentModel from './DependentModel';


class HolderModel extends Model<IHolderBase> {
    declare holder_id: number;
    declare user_id: number;
    declare subscription_number?: number | null;
    declare status: string;
    declare created_at: Date;
    authentication?: IAuthentication
    user?: UserNestedProps
    subscription?: IMember
    dependent?: DependentModel

    static INIT(sequelize: Sequelize): ModelStatic<HolderModel> {
        super.init({
            holder_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                references: {
                    model: UserModel,
                    key: 'user_id',
                },
            },
            subscription_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            status: {
                type: DataTypes.STRING(13),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'HOLDER',
            modelName: 'HolderModel',
            timestamps: false,
        })


        UserModel.hasOne(this, {
            foreignKey: 'user_id',
            as: 'holder',
            onDelete: 'CASCADE'
        })

        this.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user'
        })

        return this
    }
}


export default HolderModel;