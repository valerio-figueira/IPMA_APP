import { Model, DataTypes, ModelStatic } from 'sequelize';
import UserModel from './UserModel';
import { ILocation } from '../../interfaces/IUser';
import { TLocationModel } from '../../types/TModels';


class LocationModel extends Model<ILocation> {
    declare location_id: number;
    declare user_id: number;
    declare address?: string | null;
    declare number?: number | null;
    declare neighborhood?: string | null;
    declare city?: string | null;
    declare zipcode?: string | null
    declare state?: string | null;
    declare created_at: Date;

    static INIT(sequelize: any)
    : ModelStatic<LocationModel> {
        super.init({
            location_id: {
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
            address: {
                type: DataTypes.STRING(50),
                defaultValue: null
            },
            number: {
                type: DataTypes.INTEGER,
                defaultValue: null
            },
            neighborhood: {
                type: DataTypes.STRING(30),
                defaultValue: null
            },
            city: {
                type: DataTypes.STRING(30),
                defaultValue: null
            },
            zipcode: {
                type: DataTypes.STRING(10),
                defaultValue: null
            },
            state: {
                type: DataTypes.STRING(2),
                defaultValue: null
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            tableName: 'LOCATION',
            modelName: 'LocationModel',
            timestamps: false,
        })

        const locationModel = sequelize.models.LocationModel
        this.createAssociations(locationModel)

        return locationModel
    }

    private static createAssociations(LocationModel: TLocationModel) {
        UserModel.hasOne(LocationModel, {
            foreignKey: 'user_id',
            as: 'location',
            onDelete: 'CASCADE'
        })
        LocationModel.belongsTo(UserModel, {
            foreignKey: 'user_id'
        });
    }
}


export default LocationModel;