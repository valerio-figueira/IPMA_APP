import { Model, DataTypes } from 'sequelize';
import Database from "../db/Database";
import IAccessHierarchy from '../interfaces/IAccessHierarchy';

const db = new Database;

class AccessHierarchyModel extends Model<IAccessHierarchy> {
  hierarchy_id!: number;
  level_name!: string;
  parent_level_id?: number | null;
  created_at!: Date;
}

AccessHierarchyModel.init(
  {
    hierarchy_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    level_name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    parent_level_id: {
      type: DataTypes.INTEGER,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    }
  },
  {
    sequelize: db.sequelize,
    modelName: 'AccessHierarchyModel',
    tableName: 'ACCESS_HIERARCHY',
    timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
  }
);

AccessHierarchyModel.belongsTo(AccessHierarchyModel, {
  foreignKey: 'parent_level_id',
  as: 'parentLevel',
});

export default AccessHierarchyModel