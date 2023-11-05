import { Model, DataTypes, ModelStatic } from 'sequelize';
import { IDoctor } from '../interfaces/IDoctor';


class DoctorModel extends Model<IDoctor> {
    declare doctor_id: number;
    declare provider_code: number;
    declare doctor_name: string;
    declare speciality: string;
    declare location: string;
    declare zip_code: string;
    declare address: string;
    declare neighborhood: string;
    declare phone_number: string;
    declare created_at: Date;

    static INIT(sequelize: any): ModelStatic<DoctorModel> {
        super.init({
            doctor_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            provider_code: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            doctor_name: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            speciality: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            location: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            zip_code: {
                type: DataTypes.STRING(10),
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING(60),
                allowNull: false,
            },
            neighborhood: {
                type: DataTypes.STRING(30),
                allowNull: false,
            },
            phone_number: {
                type: DataTypes.STRING(70),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        }, {
            sequelize,
            modelName: 'DoctorModel',
            tableName: 'DOCTOR',
            charset: 'utf8',
            collate: 'utf8_unicode_ci',
            timestamps: false,
        })

        return sequelize.models.DoctorModel
    }
}


export default DoctorModel