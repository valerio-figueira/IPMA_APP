import { Model, DataTypes, Sequelize, ModelStatic } from 'sequelize';
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

  static INIT(sequelize: any): ModelStatic<DependentModel> {
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
          model: UserModel.INIT(sequelize),
          key: 'user_id',
        },
      },
      holder_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: HolderModel.INIT(sequelize),
          key: 'holder_id',
        },
      },
      relationship_degree: {
        type: DataTypes.STRING(14),
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

    UserModel.hasOne(this, {
      foreignKey: 'user_id',
      as: 'dependent',
      onDelete: 'CASCADE'
    });

    HolderModel.hasOne(this, {
      foreignKey: 'holder_id',
      as: 'dependent',
      onDelete: 'CASCADE'
    });

    this.belongsTo(UserModel, {
      foreignKey: 'user_id',
      as: 'user',
    });

    this.belongsTo(HolderModel, {
      foreignKey: 'holder_id',
      as: 'holder',
    });

    return sequelize.models.DependentModel
  }
}


export default DependentModel;