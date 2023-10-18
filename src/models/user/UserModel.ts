import { Model, DataTypes } from 'sequelize';
import { IUser } from '../../interfaces/IUser';


class UserModel extends Model<IUser> {
    declare user_id: number;
    declare name: string;
    declare gender: 'Masculino' | 'Feminino' | 'Outro';
    declare marital_status?: string | null;
    declare birth_date?: Date | null;
    declare father_name?: string | null;
    declare mother_name?: string | null;
    declare created_at: Date;

    static init(sequelize: any) {
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
                type: DataTypes.STRING(10),
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

        return sequelize.models.UserModel
    }
}


export default UserModel