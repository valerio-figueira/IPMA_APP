import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import UserModel from './user/UserModel';
import { IHolderBase } from '../interfaces/IHolder';
import { UserNestedProps } from '../interfaces/IUser';
import { THolderModel } from '../types/TModels';
import IAuthentication from '../interfaces/IAuthentication';
import IMember from '../interfaces/IMember';


class HolderModel extends Model<IHolderBase> {
    declare holder_id: number;
    declare user_id: number;
    declare subscription_number?: number | null;
    declare status: 'ATIVO(A)' | 'APOSENTADO(A)' | 'LICENÇA';
    declare created_at: Date;
    authentication?: IAuthentication
    user?: UserNestedProps
    member?: IMember

    static INIT(sequelize: any): ModelStatic<HolderModel> {
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
                    model: UserModel.INIT(sequelize),
                    key: 'user_id',
                },
            },
            subscription_number: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: null
            },
            status: {
                type: DataTypes.ENUM('ATIVO(A)', 'APOSENTADO(A)', 'LICENÇA'),
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

        return sequelize.models.HolderModel
    }
}


export default HolderModel;