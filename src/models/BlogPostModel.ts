import { Model, DataTypes } from 'sequelize';
import PostAuthorModel from './PostAuthor';
import IBlogPost from '../interfaces/IBlogPost';

class BlogPostModel extends Model<IBlogPost> {
    declare post_id: number;
    declare author_id: number;
    declare title: string;
    declare content: string;
    declare category: string;
    declare tags: string;
    declare views: number;
    declare created_at: Date;

    static init(sequelize: any) {
        super.init({
            post_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            author_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: PostAuthorModel,
                    key: 'sst_author_id'
                }
            },
            title: {
                type: DataTypes.STRING(70),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(50),
                allowNull: true,
            },
            tags: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            views: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
            },
            last_edit: {
                type: DataTypes.DATE,
                defaultValue: null
            },
            last_editor_id: {
                type: DataTypes.INTEGER,
                defaultValue: null,
                references: {
                    model: PostAuthorModel,
                    key: 'sst_author_id'
                }
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: false,
            }
        }, {
            sequelize,
            modelName: 'BlogPostModel',
            tableName: 'BLOG_POSTS',
            timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
        })

        const BlogPostModel = sequelize.models.BlogPostModel

        PostAuthorModel.hasOne(BlogPostModel, {
            foreignKey: '',
            as: ''
        })

        BlogPostModel.belongsTo(PostAuthorModel, {
            foreignKey: '',
            as: ''
        })


        return BlogPostModel
    }
}

export default BlogPostModel