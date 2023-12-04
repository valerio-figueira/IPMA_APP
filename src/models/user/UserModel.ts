import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import { IUser } from '../../interfaces/IUser';
import AuthenticationModel from '../AuthenticationModel';
import { TUserModel } from '../../types/TModels';
import ContactModel from './ContactModel';
import DocumentModel from './DocumentModel';
import LocationModel from './LocationModel';


class UserModel extends Model<IUser> {
    declare user_id: number;
    declare name: string;
    declare gender: 'Masculino' | 'Feminino' | 'Outro';
    declare marital_status?: string | null;
    declare birth_date?: Date | null;
    declare father_name?: string | null;
    declare mother_name?: string | null;
    declare created_at: Date;

    static INIT(sequelize: any)
        : ModelStatic<UserModel> {
        super.init({
            user_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            gender: {
                type: DataTypes.ENUM('Masculino', 'Feminino', 'Outro'),
            },
            marital_status: {
                type: DataTypes.STRING(13),
                defaultValue: null
            },
            birth_date: {
                type: DataTypes.DATE,
                defaultValue: null
            },
            father_name: {
                type: DataTypes.STRING(50),
                defaultValue: null
            },
            mother_name: {
                type: DataTypes.STRING(50),
                defaultValue: null
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'USER',
            modelName: 'UserModel',
            timestamps: false,
        })

        const UserModel = sequelize.models.UserModel

        this.createAssociations(UserModel, sequelize)

        return UserModel
    }

    static createAssociations(UserModel: TUserModel, sequelize: Sequelize) {
        UserModel.hasOne(AuthenticationModel.INIT(sequelize), {
            foreignKey: 'user_id',
            as: 'authentication',
            onDelete: 'CASCADE'
        })

        AuthenticationModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE'
        })

        UserModel.hasOne(ContactModel.INIT(sequelize), {
            foreignKey: 'user_id',
            as: 'contact',
            onDelete: 'CASCADE'
        })

        ContactModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });

        UserModel.hasOne(DocumentModel.INIT(sequelize), {
            foreignKey: 'user_id',
            as: 'document',
            onDelete: 'CASCADE'
        })

        DocumentModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });

        UserModel.hasOne(LocationModel.INIT(sequelize), {
            foreignKey: 'user_id',
            as: 'location',
            onDelete: 'CASCADE'
        })

        LocationModel.belongsTo(UserModel, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    }
}


export default UserModel