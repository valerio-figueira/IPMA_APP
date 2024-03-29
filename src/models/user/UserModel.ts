import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import { IUser } from '../../interfaces/IUser';
import DocumentModel from './DocumentModel';
import LocationModel from './LocationModel';
import ContactModel from './ContactModel';


class UserModel extends Model<IUser> {
    declare user_id: number;
    declare name: string;
    declare gender: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    declare marital_status?: string | null;
    declare birth_date?: Date | null;
    declare father_name?: string | null;
    declare mother_name?: string | null;
    declare created_at: Date;
    document?: DocumentModel;
    location?: LocationModel;
    contact?: ContactModel;

    static INIT(sequelize: Sequelize)
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
                type: DataTypes.ENUM('MASCULINO', 'FEMININO', 'OUTRO'),
            },
            marital_status: {
                type: DataTypes.STRING(13),
                defaultValue: null
            },
            birth_date: {
                type: DataTypes.DATEONLY,
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

        return this
    }
}


export default UserModel