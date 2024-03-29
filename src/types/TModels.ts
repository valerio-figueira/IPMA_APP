import { ModelStatic } from "sequelize"
import AccessHierarchyModel from "../models/AccessHierarchyModel"
import AgreementModel from "../models/AgreementModel"
import AuthenticationModel from "../models/AuthenticationModel"
import DependentModel from "../models/DependentModel"
import DoctorModel from "../models/DoctorModel"
import HolderModel from "../models/HolderModel"
import MemberModel from "../models/MemberModel"
import MonthlyFeeModel from "../models/MonthlyFeeModel"
import ContactModel from "../models/user/ContactModel"
import DocumentModel from "../models/user/DocumentModel"
import LocationModel from "../models/user/LocationModel"
import UserModel from "../models/user/UserModel"
import SSTModel from "../models/SocialSecurityTeamModel"
import PostAuthorModel from "../models/PostAuthor"
import BlogPostModel from "../models/BlogPostModel"
import QuoteModel from "../models/QuoteModel"
import AppointmentModel from "../models/AppointmentModel"
import SymmetricKeyModel from "../models/SymmetricKeyModel"
import OrthoHistoryModel from "../models/OrthoHistoryModel"
import InstallmentModel from "../models/InstallmentModel"
import PaymentModel from "../models/PaymentModel"

export type TAccessHierarchyModel = ModelStatic<AccessHierarchyModel>
export type TAuthenticationModel = ModelStatic<AuthenticationModel>
export type TAgreementModel = ModelStatic<AgreementModel>
export type TDependentModel = ModelStatic<DependentModel>
export type TDoctorModel = ModelStatic<DoctorModel>
export type THolderModel = ModelStatic<HolderModel>
export type TMemberModel = ModelStatic<MemberModel>
export type TMonthlyFeeModel = ModelStatic<MonthlyFeeModel>
export type TUserModel = ModelStatic<UserModel>
export type TDocumentModel = ModelStatic<DocumentModel>
export type TLocationModel = ModelStatic<LocationModel>
export type TContactModel = ModelStatic<ContactModel>
export type TSSTModel = ModelStatic<SSTModel>
export type TPostAuthorModel = ModelStatic<PostAuthorModel>
export type TBlogPostModel = ModelStatic<BlogPostModel>
export type TQuotesModel = ModelStatic<QuoteModel>
export type TAppointmentModel = ModelStatic<AppointmentModel>
export type TSymmetricKeyModel = ModelStatic<SymmetricKeyModel>
export type TOrthoHistoryModel = ModelStatic<OrthoHistoryModel>
export type TInstallmentModel = ModelStatic<InstallmentModel>
export type TPaymentModel = ModelStatic<PaymentModel>