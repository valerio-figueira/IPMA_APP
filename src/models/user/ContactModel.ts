import { Model, DataTypes } from 'sequelize';
import UserModel from './UserModel';
import { IContact } from '../../interfaces/IUser';
import { TContactModel } from '../../types/TModels';


class ContactModel extends Model<IContact> {
  declare contact_id: number;
  declare user_id: number;
  declare phone_number?: string | null;
  declare residential_phone?: string | null;
  declare email?: string | null;
  declare created_at: Date;

  static init(sequelize: any) {
    super.init({
      contact_id: {
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
      phone_number: {
        type: DataTypes.STRING(11),
        defaultValue: null
      },
      residential_phone: {
        type: DataTypes.STRING(11),
        defaultValue: null
      },
      email: {
        type: DataTypes.STRING(50),
        unique: true,
        defaultValue: null
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      }
    }, {
      sequelize,
      tableName: 'CONTACT',
      modelName: 'ContactModel',
      timestamps: false,
    })

    const contactModel = sequelize.models.ContactModel
    this.createAssociations(contactModel)

    return contactModel
  }

  private static createAssociations(ContactModel: TContactModel) {
    UserModel.hasOne(ContactModel, {
      foreignKey: 'user_id',
      as: 'contact'
    })
    ContactModel.belongsTo(UserModel, {
      foreignKey: 'user_id'
    });
  }
}


export default ContactModel;