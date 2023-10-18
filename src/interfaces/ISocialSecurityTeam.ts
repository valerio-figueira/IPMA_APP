import IAuthentication from "./IAuthentication";
import { IContact, IDocument, ILocation, IUser } from "./IUser";

export default interface ISocialSecurityTeam {
    sst_member_id?: number;
    user_id: number;
    role: string;
    created_at?: Date;
}

export interface SST_Props {
    authentication: IAuthentication
    user: IUser
    document: IDocument
    contact: IContact
    location: ILocation
    sstEntity: ISocialSecurityTeam
}