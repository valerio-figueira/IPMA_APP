import MonthlyFeeModel from "../models/MonthlyFeeModel";
import AgreementModel from "../models/AgreementModel";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";


export default class Queries {

    static ContractRegistryIncludeAll = [{
        model: MonthlyFeeModel,
        as: 'billing',
        attributes: { exclude: ['member_id'] }
    }, {
        model: AgreementModel,
        as: 'contract'
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: { exclude: ['user_id'] },
        include: [{
            model: UserModel,
            as: 'user'
        }]
    }]

    static IncludeUserData = [{
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

}