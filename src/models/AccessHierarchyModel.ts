import { Model, DataTypes, ModelStatic } from 'sequelize';
import IAccessHierarchy from '../interfaces/IAccessHierarchy';


class AccessHierarchyModel extends Model<IAccessHierarchy> {
  declare hierarchy_id: number;
  declare level_name: string;
  declare parent_level_id?: number | null;
  declare created_at: Date;

  static INIT(sequelize: any)
  : ModelStatic<AccessHierarchyModel> {
    super.init({
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
        references: {
          model: AccessHierarchyModel,
          key: 'hierarchy_id'
        }
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
    }, {
      sequelize: sequelize,
      modelName: 'AccessHierarchyModel',
      tableName: 'ACCESS_HIERARCHY',
      timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
    })

    sequelize.models.AccessHierarchyModel.belongsTo(AccessHierarchyModel, {
      foreignKey: 'parent_level_id',
      as: 'parentLevel',
    });

    return sequelize.models.AccessHierarchyModel
  }
}

export default AccessHierarchyModel