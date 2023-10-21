import { Model, DataTypes, ModelStatic, Sequelize } from 'sequelize';
import SSTModel from './SocialSecurityTeamModel';
import BlogPostModel from './BlogPostModel';
import IPostAuthor from '../interfaces/IPostAuthor';

class PostAuthorModel extends Model<IPostAuthor> {
    declare post_author_id: number;
    declare sst_author_id: number;
    declare post_id: number;
    declare created_at: Date;

    static INIT(sequelize: any): ModelStatic<PostAuthorModel> {
        super.init({
            post_author_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            sst_author_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: SSTModel,
                    key: 'sst_member_id'
                }
            },
            post_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: BlogPostModel,
                    key: 'post_id'
                }
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'PostAuthorModel',
            tableName: 'POST_AUTHORS',
            timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
        })

        const PostAuthorModel = sequelize.models.PostAuthorModel
        this.createAssociations(PostAuthorModel, sequelize)

        return PostAuthorModel
    }

    static createAssociations(PostAuthorModel: any, sequelize: Sequelize) {
        SSTModel.INIT(sequelize).hasMany(PostAuthorModel, {
            foreignKey: 'sst_author_id',
            as: 'authors',
            onDelete: 'CASCADE'
        })

        PostAuthorModel.INIT(sequelize).belongsTo(SSTModel, {
            foreignKey: 'sst_member_id',
            as: 'socialTeam'
        })

        BlogPostModel.INIT(sequelize).hasMany(PostAuthorModel, {
            foreignKey: 'post_id',
            as: 'authors',
        })

        PostAuthorModel.belongsTo(BlogPostModel, {
            foreignKey: 'post_id',
            as: 'post'
        })
    }
}

export default PostAuthorModel