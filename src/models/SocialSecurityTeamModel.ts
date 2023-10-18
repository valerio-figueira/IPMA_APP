import { Model, DataTypes } from 'sequelize';
import UserModel from './user/UserModel';
import ISocialSecurityTeam from '../interfaces/ISocialSecurityTeam';


class SSTModel extends Model<ISocialSecurityTeam> {
    declare sst_member_id: number;
    declare user_id: number;
    declare role: string;
    declare created_at: Date;

    static init(sequelize: any) {
        super.init({
            sst_member_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: UserModel,
                    key: 'user_id'
                }
            },
            role: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'SSTModel',
            tableName: 'SOCIAL_SECURITY_TEAM',
            timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
        })

        const SSTModel = sequelize.models.SSTModel

        UserModel.hasOne(SSTModel, {
            foreignKey: 'user_id',
            as: 'SSTModel'
        });

        SSTModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user'
        });

        return SSTModel
    }
}

export default SSTModel