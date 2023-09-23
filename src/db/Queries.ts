import BillingModel from "../models/BillingModel";
import BusinessContractModel from "../models/BusinessContractModel";
import HolderModel from "../models/HolderModel";
import ContactModel from "../models/user/ContactModel";
import DocumentModel from "../models/user/DocumentModel";
import LocationModel from "../models/user/LocationModel";
import UserModel from "../models/user/UserModel";


export default class Queries {

    static ContractRegistryIncludeAll = [{
        model: BillingModel,
        as: 'billing',
        attributes: { exclude: ['id_conveniado'] }
    }, {
        model: BusinessContractModel,
        as: 'contract'
    }, {
        model: HolderModel,
        as: 'holder',
        attributes: { exclude: ['id_usuario'] },
        include: [{
            model: UserModel,
            as: 'user'
        }]
    }]


}