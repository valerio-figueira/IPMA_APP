import { Model, DataTypes } from 'sequelize';
import Database from "../../db/Database";
import UserModel from './UserModel';
import { IContact } from '../../interfaces/IUser';

const db = new Database;

class ContactModel extends Model<IContact> {
  contact_id!: number;
  user_id!: number;
  phone_number?: string | null;
  residential_phone?: string | null;
  email?: string | null;
}

ContactModel.init(
  {
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
  },
  {
    sequelize: db.sequelize,
    tableName: 'CONTACT',
    modelName: 'ContactModel',
    timestamps: false,
  }
);

export default ContactModel;