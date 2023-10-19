import { Model, DataTypes, ModelStatic } from 'sequelize';
import IAuthentication from '../interfaces/IAuthentication';
import UserModel from './user/UserModel';
import AccessHierarchyModel from './AccessHierarchyModel';
import IAccessHierarchy from '../interfaces/IAccessHierarchy';
import { TAuthenticationModel } from '../types/TModels';

class AuthenticationModel extends Model<IAuthentication> {
    declare authentication_id: number;
    declare user_id: number;
    declare hierarchy_id: number;
    declare username: string;
    declare password: string;
    declare user_photo: string | null;
    declare hierarchy: IAccessHierarchy;
    declare created_at: Date;

    static INIT(sequelize: any)
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

        const AuthenticationModel = sequelize.models.AuthenticationModel

        this.createAssociations(AuthenticationModel)

        return AuthenticationModel
    }

    static createAssociations(AuthenticationModel: TAuthenticationModel) {
        AccessHierarchyModel.hasOne(AuthenticationModel, {
            foreignKey: 'hierarchy_id',
            as: 'hierarchy'
        })

        UserModel.hasOne(AuthenticationModel, {
            foreignKey: 'user_id',
            as: 'authentication',
            onDelete: 'CASCADE'
        })

        AuthenticationModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user'
        })

        AuthenticationModel.belongsTo(AccessHierarchyModel, {
            foreignKey: 'hierarchy_id',
            as: 'hierarchy',
        });
    }
}

export default AuthenticationModel