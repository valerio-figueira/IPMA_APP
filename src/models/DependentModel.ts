import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import UserModel from './user/UserModel';
import HolderModel from './HolderModel';
import { IDependentBase } from '../interfaces/IDependent';

const db = new Database;

class DependentModel extends Model<IDependentBase> {
  dependent_id!: number;
  user_id!: number;
  holder_id!: number;
  relationship_degree?: string | null;
}

DependentModel.init(
  {
    dependent_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: UserModel,
        key: 'user_id',
      },
    },
    holder_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: HolderModel,
        key: 'holder_id',
      },
    },
    relationship_degree: {
      type: DataTypes.STRING(11),
    },
  },
  {
    sequelize: db.sequelize,
    tableName: 'DEPENDENT',
    modelName: 'DependentModel',
    timestamps: false,
  }
);

UserModel.hasOne(DependentModel, {
  foreignKey: 'user_id',
  as: 'dependent',
});

HolderModel.hasMany(DependentModel, {
  foreignKey: 'holder_id',
  as: 'dependent',
});

DependentModel.belongsTo(UserModel, {
  foreignKey: 'user_id',
  as: 'user',
});

DependentModel.belongsTo(HolderModel, {
  foreignKey: 'holder_id',
  as: 'holder',
});

export default DependentModel;