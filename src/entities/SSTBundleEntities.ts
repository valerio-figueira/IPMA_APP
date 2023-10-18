import IAuthentication from "../interfaces/IAuthentication";
import ContactEntity from "./ContactEntity";
import DocumentEntity from "./DocumentEntity";
import LocationEntity from "./LocationEntity";
import SocialSecurityTeamEntity from "./SocialSecurityTeamEntity";
import UserEntity from "./UserEntity";
import { SST_Props } from "../interfaces/ISocialSecurityTeam";


class SSTBundleEntities {
    authentication: IAuthentication
    user: UserEntity
    document: DocumentEntity
    contact: ContactEntity
    location: LocationEntity
    sstEntity: SocialSecurityTeamEntity

    constructor(props: SST_Props) {
        this.authentication = props.authentication
        this.user = props.user
        this.document = props.document
        this.contact = props.contact
        this.location = props.location
        this.sstEntity = props.sstEntity
    }
}

export default SSTBundleEntities