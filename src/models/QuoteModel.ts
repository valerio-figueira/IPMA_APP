import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';

interface IQuoteModel {
    quote_id: number;
    phrase: string;
    author: string;
    created_at: Date;
}

class QuoteModel extends Model<IQuoteModel> {
    declare quote_id: number;
    declare phrase: string;
    declare author: string;
    declare created_at: Date;

    static INIT(sequelize: Sequelize): ModelStatic<QuoteModel> {
        super.init({
            quote_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            phrase: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            author: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: 'QUOTES',
            modelName: 'QuoteModel',
            timestamps: false,
        })

        return this
    }
}


export default QuoteModel;