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