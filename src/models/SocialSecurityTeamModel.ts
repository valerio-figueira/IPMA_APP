import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import UserModel from './user/UserModel';
import ISocialSecurityTeam from '../interfaces/ISocialSecurityTeam';


class SSTModel extends Model<ISocialSecurityTeam> {
    declare sst_member_id: number;
    declare user_id: number;
    declare role: string;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<SSTModel> {
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
                unique: true,
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

        UserModel.hasOne(this, {
            foreignKey: 'user_id',
            as: 'socialTeam',
            onDelete: 'CASCADE',
            hooks: true
        })

        this.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user'
        })

        return this
    }
}

export default SSTModel