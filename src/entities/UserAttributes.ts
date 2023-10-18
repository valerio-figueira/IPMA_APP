import IAuthentication from "../interfaces/IAuthentication";
import { IDependentBase } from "../interfaces/IDependent";
import { IHolderBase } from "../interfaces/IHolder";
import IMember from "../interfaces/IMember";
import ISocialSecurityTeam from "../interfaces/ISocialSecurityTeam";
import { IUserAttributes } from "../interfaces/IUser";
import ContactEntity from "./ContactEntity";
import DependentEntity from "./DependentEntity";
import DocumentEntity from "./DocumentEntity";
import HolderEntity from "./HolderEntity";
import LocationEntity from "./LocationEntity";
import MemberEntity from "./MemberEntity";
import SocialSecurityTeamEntity from "./SocialSecurityTeamEntity";
import UserEntity from "./UserEntity";


class UserAttributes {
    authentication?: IAuthentication;
    user: UserEntity;
    document: DocumentEntity;
    contact: ContactEntity;
    location: LocationEntity;
    sstEntity?: SocialSecurityTeamEntity;
    holder?: HolderEntity;
    dependent?: DependentEntity;
    contract?: MemberEntity;

    constructor(attributes: IUserAttributes) {
        this.user = new UserEntity(attributes.user);
        this.document = new DocumentEntity(attributes.document);
        this.contact = new ContactEntity(attributes.contact);
        this.location = new LocationEntity(attributes.location);
    }

    addSocialSecurityTeam(sst: ISocialSecurityTeam) {
        this.sstEntity = new SocialSecurityTeamEntity(sst)
    }

    addHolder(holder: IHolderBase) {
        this.holder = new HolderEntity(holder)
    }

    addDependent(dependent: IDependentBase) {
        this.dependent = new DependentEntity(dependent)
    }

    addContract(contract: IMember) {
        this.contract = new MemberEntity(contract)
    }

    addAuthentication(authentication: IAuthentication) {
        this.authentication = authentication
    }
}

export default UserAttributes