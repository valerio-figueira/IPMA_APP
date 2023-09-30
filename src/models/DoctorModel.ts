import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import { IDoctor } from '../interfaces/IDoctor';

const db = new Database;

class DoctorModel extends Model<IDoctor> { }

DoctorModel.init(
    {
        id_medico: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        codigo_prestador: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        nome_medico: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        especialidade: {
            type: DataTypes.STRING(60),
            allowNull: false,
        },
        localidade: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        cep: {
            type: DataTypes.STRING(10),
            allowNull: true,
        },
        endereco: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        bairro: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        telefone: {
            type: DataTypes.STRING(40),
            allowNull: true,
        },
        data_registro: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize: db.sequelize,
        modelName: 'DoctorModel',
        tableName: 'MEDICOS',
        charset: 'utf8',
        collate: 'utf8_unicode_ci',
        timestamps: false,
    }
);


export default DoctorModel