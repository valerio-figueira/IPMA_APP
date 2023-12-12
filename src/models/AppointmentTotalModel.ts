import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import AppointmentModel from "./AppointmentModel";


class AppointmentTotalModel extends Model {
    static INIT(sequelize: Sequelize): ModelStatic<AppointmentTotalModel> {
        super.init(
            {
                appointment_total_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    primaryKey: true,
                },
                member_id: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    references: {
                        model: AppointmentModel,
                        key: 'member_id'
                    },
                },
                reference_month: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 1,
                        max: 12,
                    },
                },
                reference_year: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    validate: {
                        min: 2015,
                    },
                },
                total_amount: {
                    type: DataTypes.INTEGER,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                sequelize,
                tableName: 'MONTHLY_TOTAL',
                modelName: 'MonthlyTotalModel',
                timestamps: false,
            }
        )

        return this
    }
}


export default AppointmentTotalModel