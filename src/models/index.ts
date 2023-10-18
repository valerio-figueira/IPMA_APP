import { Sequelize } from "sequelize";
import AccessHierarchyModel from "./AccessHierarchyModel";
import AuthenticationModel from "./AuthenticationModel";
import AgreementModel from "./AgreementModel";
import DependentModel from "./DependentModel";
import DoctorModel from "./DoctorModel";
import HolderModel from "./HolderModel";
import MemberModel from "./MemberModel";
import MonthlyFeeModel from "./MonthlyFeeModel";
import UserModel from "./user/UserModel";
import DocumentModel from "./user/DocumentModel";
import LocationModel from "./user/LocationModel";
import ContactModel from "./user/ContactModel";
import SSTModel from "./SocialSecurityTeamModel";
import BlogPostModel from "./BlogPostModel";
import PostAuthorModel from "./PostAuthor";
import * as ModelTypes from "../types/TModels";


class Models {
    AccessHierarchyModel: ModelTypes.TAccessHierarchyModel
    AgreementModel: ModelTypes.TAgreementModel
    AuthenticationModel: ModelTypes.TAuthenticationModel
    DependentModel: ModelTypes.TDependentModel
    HolderModel: ModelTypes.THolderModel
    MemberModel: ModelTypes.TMemberModel
    MonthlyFeeModel: ModelTypes.TMonthlyFeeModel
    DoctorModel: ModelTypes.TDoctorModel
    UserModel: ModelTypes.TUserModel
    DocumentModel: ModelTypes.TDocumentModel
    LocationModel: ModelTypes.TLocationModel
    ContactModel: ModelTypes.TContactModel
    SSTModel: ModelTypes.TSSTModel
    BlogPostModel: ModelTypes.TBlogPostModel
    PostAuthorModel: ModelTypes.TPostAuthorModel

    constructor(sequelize: Sequelize) {
        this.UserModel = UserModel.init(sequelize)
        this.DocumentModel = DocumentModel.init(sequelize)
        this.LocationModel = LocationModel.init(sequelize)
        this.ContactModel = ContactModel.init(sequelize)
        this.AccessHierarchyModel = AccessHierarchyModel.init(sequelize)
        this.AgreementModel = AgreementModel.init(sequelize)
        this.AuthenticationModel = AuthenticationModel.init(sequelize)
        this.HolderModel = HolderModel.init(sequelize)
        this.DependentModel = DependentModel.init(sequelize)
        this.MemberModel = MemberModel.init(sequelize)
        this.MonthlyFeeModel = MonthlyFeeModel.init(sequelize)
        this.DoctorModel = DoctorModel.init(sequelize)
        this.SSTModel = SSTModel.init(sequelize)
        this.BlogPostModel = BlogPostModel.init(sequelize)
        this.PostAuthorModel = PostAuthorModel.init(sequelize)
    }


}

export default Models