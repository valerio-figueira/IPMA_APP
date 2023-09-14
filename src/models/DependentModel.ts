import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import HolderModel from './HolderModel';

const db = new Database;

class DependentModel extends Model {
  id_dependente!: number;
  id_usuario!: number;
  id_titular!: number;
  grau_parentesco?: string | null;
}

DependentModel.init(
  {
    id_dependente: {
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
    id_titular: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HolderModel,
        key: 'id_titular',
      },
    },
    grau_parentesco: {
      type: DataTypes.STRING(11),
    },
  },
  {
    sequelize: db.sequelize,
    tableName: 'DEPENDENTE',
    modelName: 'Dependente',
    timestamps: false,
  }
);

export default DependentModel;