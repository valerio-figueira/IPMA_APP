import IAuthentication from "../interfaces/IAuthentication";
import { IDependentProps } from "../interfaces/IDependent";
import AuthenticationEntity from "./AuthenticationEntity";
import ContactEntity from "./ContactEntity";
import DependentEntity from "./DependentEntity";
import DocumentEntity from "./DocumentEntity";
import LocationEntity from "./LocationEntity";
import MemberEntity from "./MemberEntity";
import MonthlyFeeEntity from "./MonthlyFeeEntity";
import UserEntity from "./UserEntity";


class DependentBundleEntities {
    authentication?: IAuthentication;
    dependent: DependentEntity;
    user: UserEntity;
    document: DocumentEntity;
    contact: ContactEntity;
    location: LocationEntity;
    member: MemberEntity;
    monthly_fee: MonthlyFeeEntity;

    constructor(props: IDependentProps) {
        this.dependent = props.dependent
        this.user = props.user
        this.document = props.document
        this.contact = props.contact
        this.location = props.location
        this.member = props.member
        this.monthly_fee = props.monthly_fee
    }

    setAuthentication(auth: IAuthentication) {
        this.authentication = new AuthenticationEntity(auth)
    }

}

export default DependentBundleEntities