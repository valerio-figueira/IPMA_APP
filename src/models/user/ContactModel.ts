import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';
import { IContact } from '../../interfaces/IUser';

const db = new Database;

class ContactModel extends Model<IContact> {
  id_contato!: number;
  id_usuario!: number;
  celular_1?: string | null;
  celular_2?: string | null;
  tel_residencial?: string | null;
  email?: string | null;
}

ContactModel.init(
  {
    id_contato: {
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
    celular_1: {
      type: DataTypes.STRING(11),
    },
    celular_2: {
      type: DataTypes.STRING(11),
    },
    tel_residencial: {
      type: DataTypes.STRING(10),
    },
    email: {
      type: DataTypes.STRING(50),
      unique: true,
    },
  },
  {
    sequelize: db.sequelize,
    tableName: 'CONTATO',
    modelName: 'ContactModel',
    timestamps: false,
  }
);

export default ContactModel;