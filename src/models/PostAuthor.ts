import { Model, DataTypes } from 'sequelize';
import SSTModel from './SocialSecurityTeamModel';
import BlogPostModel from './BlogPostModel';
import IPostAuthor from '../interfaces/IPostAuthor';

class PostAuthorModel extends Model<IPostAuthor> {
    declare post_author_id: number;
    declare sst_author_id: number;
    declare post_id: number;
    declare created_at: Date;

    static init(sequelize: any) {
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
            modelName: 'SSTModel',
            tableName: 'SOCIAL_SECURITY_TEAM',
            timestamps: false, // Se não precisa de colunas 'createdAt' e 'updatedAt'
        })

        const PostAuthorModel = sequelize.models.PostAuthorModel
        this.createAssociations(PostAuthorModel)

        return PostAuthorModel
    }

    static createAssociations(PostAuthorModel: any) {
        SSTModel.hasMany(PostAuthorModel, {
            foreignKey: 'sst_author_id',
            as: 'PostAuthorModel'
        })

        PostAuthorModel.belongsTo(SSTModel, {
            foreignKey: 'sst_member_id',
            as: 'SSTModel'
        })

        BlogPostModel.hasMany(PostAuthorModel, {
            foreignKey: 'sst_author_id',
            as: 'PostAuthorModel'
        })

        PostAuthorModel.belongsTo(BlogPostModel, {
            foreignKey: 'author_id',
            as: 'BlogPostModel'
        })
    }
}

export default PostAuthorModel