import { Model, DataTypes, Sequelize } from 'sequelize';
import UserModel from './user/UserModel';
import HolderModel from './HolderModel';
import { IDependentBase } from '../interfaces/IDependent';
import { IUser } from '../interfaces/IUser';
import { TDependentModel } from '../types/TModels';


class DependentModel extends Model<IDependentBase> {
  declare dependent_id: number;
  declare user_id: number;
  declare holder_id: number;
  declare relationship_degree?: string | null;
  declare created_at: Date;
  declare user?: IUser

  static init(sequelize: any) {
    super.init({
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
        defaultValue: null
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
    }, {
      sequelize,
      tableName: 'DEPENDENT',
      modelName: 'DependentModel',
      timestamps: false,
    })

    const dependentModel = sequelize.models.DependentModel

    this.createAssociations(dependentModel)

    return dependentModel
  }

  static createAssociations(DependentModel: TDependentModel) {
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
  }
}


export default DependentModel;