import { DataTypes, Model, ModelStatic, Sequelize } from "sequelize";
import IAppointment from "../interfaces/IAppointment";
import MemberModel from "./MemberModel";


class AppointmentModel extends Model<IAppointment> {
    declare appointment_id: number;
    declare member_id: number;
    declare description: number;
    declare amount: number;
    declare total_amount: number;
    declare appointment: Date;
    declare reference_month: number;
    declare reference_year: number;
    declare created_at: Date;

    static INIT(sequelize: Sequelize)
        : ModelStatic<AppointmentModel> {
        super.init({
            appointment_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            member_id: {
                type: DataTypes.INTEGER,
                unique: true,
                allowNull: false,
                references: {
                    model: MemberModel,
                    key: 'member_id'
                }
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            total_amount: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            appointment_date: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            reference_month: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 12
                }
            },
            reference_year: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 2015
                }
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        }, {
            sequelize,
            tableName: 'APPOINTMENT',
            modelName: 'AppointmentModel',
            timestamps: false, // Defina como true se desejar timestamps automáticos
        })


        MemberModel.hasOne(this, {
            as: 'appointment',
            foreignKey: 'member_id'
        })

        this.belongsTo(MemberModel, {
            as: 'subscription',
            foreignKey: 'member_id'
        })


        return this
    }
}


export default AppointmentModel