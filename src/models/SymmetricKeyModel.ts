import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';


class SymmetricKeyModel extends Model {
    declare symmetric_key_id: number;
    declare key_name: string;
    declare key_value: string;
    declare iv_value: string;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<SymmetricKeyModel> {
        super.init({
            symmetric_key_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            key_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            key_value: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            iv_value: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'SymmetricKeyModel',
            tableName: 'SYMMETRIC_KEY',
            timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
        })

        return this
    }
}

export default SymmetricKeyModel