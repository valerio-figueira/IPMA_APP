import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import HolderModel from './HolderModel';
import { IDependentBase } from '../interfaces/IDependent';

const db = new Database;

class DependentModel extends Model<IDependentBase> {
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
    modelName: 'DependentModel',
    timestamps: false,
  }
);

UserModel.hasOne(DependentModel, {
  foreignKey: 'id_usuario',
  as: 'dependent',
});

HolderModel.hasMany(DependentModel, {
  foreignKey: 'id_titular',
  as: 'dependent',
});

DependentModel.belongsTo(UserModel, {
  foreignKey: 'id_usuario',
  as: 'user',
});

DependentModel.belongsTo(HolderModel, {
  foreignKey: 'id_titular',
  as: 'holder',
});

export default DependentModel;