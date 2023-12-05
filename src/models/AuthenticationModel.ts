import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import IAuthentication from '../interfaces/IAuthentication';
import UserModel from './user/UserModel';
import AccessHierarchyModel from './AccessHierarchyModel';


class AuthenticationModel extends Model<IAuthentication> {
    declare authentication_id: number;
    declare user_id: number;
    declare hierarchy_id: number;
    declare username: string;
    declare password: string;
    declare user_photo: string | null;
    declare created_at: Date;
    hierarchy?: AccessHierarchyModel

    static INIT(sequelize: Sequelize)
        : ModelStatic<AuthenticationModel> {
        super.init({
            authentication_id: {
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
                    key: 'user_id',
                },
            },
            hierarchy_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: AccessHierarchyModel,
                    key: 'hierarchy_id'
                }
            },
            username: {
                type: DataTypes.STRING(30),
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            user_photo: {
                type: DataTypes.STRING(50),
                defaultValue: null
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'AuthenticationModel',
            tableName: 'AUTHENTICATION',
            timestamps: false
        })


        UserModel.hasOne(this, {
            foreignKey: 'user_id',
            as: 'authentication',
            onDelete: 'CASCADE'
        })

        this.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE'
        })

        AccessHierarchyModel.hasOne(this, {
            foreignKey: 'hierarchy_id',
            as: 'authentication',
            onDelete: 'CASCADE'
        })

        this.belongsTo(AccessHierarchyModel, {
            foreignKey: 'hierarchy_id',
            as: 'hierarchy',
        })

        return this
    }
}

export default AuthenticationModel