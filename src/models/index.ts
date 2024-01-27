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
import QuoteModel from "./QuoteModel";
import AppointmentModel from "./AppointmentModel";
import SymmetricKeyModel from "./SymmetricKeyModel"
import OrthoHistoryModel from "./OrthoHistoryModel";
import InstallmentModel from "./InstallmentModel";
import PaymentModel from "./PaymentModel";


class Models {
    AccessHierarchy: ModelTypes.TAccessHierarchyModel
    Agreement: ModelTypes.TAgreementModel
    Authentication: ModelTypes.TAuthenticationModel
    Dependent: ModelTypes.TDependentModel
    Holder: ModelTypes.THolderModel
    Member: ModelTypes.TMemberModel
    MonthlyFee: ModelTypes.TMonthlyFeeModel
    Appointment: ModelTypes.TAppointmentModel
    Doctor: ModelTypes.TDoctorModel
    User: ModelTypes.TUserModel
    Document: ModelTypes.TDocumentModel
    Location: ModelTypes.TLocationModel
    Contact: ModelTypes.TContactModel
    SocialSecurityTeam: ModelTypes.TSSTModel
    BlogPost: ModelTypes.TBlogPostModel
    PostAuthor: ModelTypes.TPostAuthorModel
    Quotes: ModelTypes.TQuotesModel
    SymmetricKey: ModelTypes.TSymmetricKeyModel
    OrthoHistory: ModelTypes.TOrthoHistoryModel
    Installment: ModelTypes.TInstallmentModel
    Payment: ModelTypes.TPaymentModel

    constructor(sequelize: Sequelize) {
        this.User = UserModel.INIT(sequelize)
        this.Document = DocumentModel.INIT(sequelize)
        this.Location = LocationModel.INIT(sequelize)
        this.Contact = ContactModel.INIT(sequelize)
        this.Holder = HolderModel.INIT(sequelize)
        this.Dependent = DependentModel.INIT(sequelize)
        this.AccessHierarchy = AccessHierarchyModel.INIT(sequelize)
        this.Authentication = AuthenticationModel.INIT(sequelize)
        this.Agreement = AgreementModel.INIT(sequelize)
        this.Member = MemberModel.INIT(sequelize)
        this.MonthlyFee = MonthlyFeeModel.INIT(sequelize)
        this.Appointment = AppointmentModel.INIT(sequelize)
        this.Doctor = DoctorModel.INIT(sequelize)
        this.SocialSecurityTeam = SSTModel.INIT(sequelize)
        this.BlogPost = BlogPostModel.INIT(sequelize)
        this.PostAuthor = PostAuthorModel.INIT(sequelize)
        this.Quotes = QuoteModel.INIT(sequelize)
        this.SymmetricKey = SymmetricKeyModel.INIT(sequelize)
        this.OrthoHistory = OrthoHistoryModel.INIT(sequelize)
        this.Installment = InstallmentModel.INIT(sequelize)
        this.Payment = PaymentModel.INIT(sequelize)
    }


}

export default Models