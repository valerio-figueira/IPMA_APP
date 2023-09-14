import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';

const db = new Database;

class LocationModel extends Model {
    id_localizacao!: number;
    id_usuario!: number;
    endereco?: string | null;
    numero?: number | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
}

LocationModel.init(
    {
        id_localizacao: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: UserModel,
                key: 'id_usuario',
            },
        },
        endereco: {
            type: DataTypes.STRING(50),
        },
        numero: {
            type: DataTypes.INTEGER,
        },
        bairro: {
            type: DataTypes.STRING(30),
        },
        cidade: {
            type: DataTypes.STRING(30),
        },
        estado: {
            type: DataTypes.STRING(2),
        },
    },
    {
        sequelize: db.sequelize,
        tableName: 'LOCALIZACAO',
        modelName: 'Localizacao',
        timestamps: false,
    }
);

export default LocationModel;