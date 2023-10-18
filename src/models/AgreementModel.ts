import { Model, DataTypes } from 'sequelize';
import IAgreement from '../interfaces/IAgreement';


class AgreementModel extends Model<IAgreement> {
    declare agreement_id: number;
    declare agreement_name: string;
    declare description: string | null;
    declare registration_date: Date;

    static init(sequelize: any) {
        super.init({
            agreement_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            agreement_name: {
                type: DataTypes.STRING(20),
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(255),
                allowNull: true,
                defaultValue: null
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            }
        }, {
            sequelize,
            tableName: 'AGREEMENT',
            modelName: 'AgreementModel',
            timestamps: false, // Defina como true se desejar timestamps automáticos
        })

        return sequelize.models.AgreementModel
    }
}


export default AgreementModel;