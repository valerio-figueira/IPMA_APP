import IAuthentication from "../interfaces/IAuthentication";
import { IHolderProps } from "../interfaces/IHolder";
import IMember from "../interfaces/IMember";
import AuthenticationEntity from "./AuthenticationEntity";
import ContactEntity from "./ContactEntity";
import DocumentEntity from "./DocumentEntity";
import HolderEntity from "./HolderEntity";
import LocationEntity from "./LocationEntity";
import MemberEntity from "./MemberEntity";
import UserEntity from "./UserEntity";


class HolderBundleEntities {
    authentication?: IAuthentication;
    user: UserEntity;
    document: DocumentEntity;
    contact: ContactEntity;
    location: LocationEntity;
    holder: HolderEntity;
    member?: MemberEntity;

    constructor(props: IHolderProps) {
        this.holder = props.holder
        this.user = props.user
        this.document = props.document
        this.contact = props.contact
        this.location = props.location
    }

    setAuthentication(auth: IAuthentication) {
        this.authentication = new AuthenticationEntity(auth)
    }

    setMember(member: IMember) {
        this.member = member
    }

}

export default HolderBundleEntities