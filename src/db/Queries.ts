import MonthlyFeeModel from "../models/MonthlyFeeModel";
import AgreementModel from "../models/AgreementModel";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import AuthenticationModel from "../models/AuthenticationModel";


export default class Queries {

    static MemberIncludeAll = [{
        model: MonthlyFeeModel,
        as: 'billing',
        attributes: { exclude: ['member_id'] }
    }, {
        model: AgreementModel,
        as: 'agreement'
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: { exclude: ['user_id'] },
        include: [{
            model: UserModel,
            as: 'user'
        }]
    }]

    static IncludeSummaryUser(where: Record<string, any>) {
        return [{
            model: UserModel,
            as: 'user',
            where,
            attributes: { exclude: ['user_id'] },
            include: [
                {
                    model: AuthenticationModel,
                    as: 'authentication',
                    attributes: { exclude: ['user_id', 'password'] },
                    include: [{
                        model: AccessHierarchyModel,
                        as: 'hierarchy'
                    }]
                }
            ]
        }]
    }

    static IncludeUserData = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: AuthenticationModel,
                as: 'authentication',
                attributes: { exclude: ['user_id', 'password'] },
                include: [{
                    model: AccessHierarchyModel,
                    as: 'hierarchy'
                }]
            },
            {
                model: ContactModel,
                as: 'contact',
                attributes: { exclude: ['user_id', 'contact_id'] }
            },
            {
                model: DocumentModel,
                as: 'document',
                attributes: { exclude: ['user_id', 'document_id'] },
            },
            {
                model: LocationModel,
                as: 'location',
                attributes: { exclude: ['user_id', 'location_id'] }
            }
        ]
    }]

    static IncludeUserDataSummary = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: AuthenticationModel,
                as: 'authentication',
                attributes: { exclude: ['user_id', 'password'] },
                include: [{
                    model: AccessHierarchyModel,
                    as: 'hierarchy'
                }]
            }
        ]
    }]

    static IncludeDependentUserData = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] },
        include: [
            {
                model: ContactModel,
                as: 'contact',
                attributes: { exclude: ['user_id', 'contact_id'] }
            },
            {
                model: DocumentModel,
                as: 'document',
                attributes: { exclude: ['user_id', 'document_id'] },
            },
            {
                model: LocationModel,
                as: 'location',
                attributes: { exclude: ['user_id', 'location_id'] }
            }
        ]
    }]

    static IncludeDependentSummary = [{
        model: UserModel,
        as: 'user',
        attributes: { exclude: ['user_id'] }
    }]

    static IncludeHierarchyAndUser = [{
        model: AccessHierarchyModel,
        as: 'hierarchy'
    },
    {
        model: UserModel,
        as: 'user'
    }]

}