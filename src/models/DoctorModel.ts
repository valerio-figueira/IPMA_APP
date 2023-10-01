import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import { IDoctor } from '../interfaces/IDoctor';

const db = new Database;

class DoctorModel extends Model<IDoctor> {
    doctor_id!: number;
    provider_code!: number;
    doctor_name!: string;
    speciality!: string;
    location!: string;
    zip_code!: string;
    address!: string;
    neighborhood!: string;
    phone_number!: string;
    registration_date!: string;
}

DoctorModel.init(
    {
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
            allowNull: true,
        },
        zip_code: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        address: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        neighborhood: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        registration_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: db.sequelize,
        modelName: 'DoctorModel',
        tableName: 'DOCTOR',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: false,
    }
);


export default DoctorModel