import IAuthentication from "./IAuthentication";
import IMember from "./IMember";
import IMonthlyFee from "./IMonthlyFee";
import { IContact, IDocument, ILocation, IUser } from "./IUser";

export interface IDependentBase {
    dependent_id?: number;
    user_id?: number;
    holder_id: number;
    relationship_degree: string | null;
    created_at?: Date;
}

export interface IDependent {
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    dependent: IDependentBase;
}

export interface IDependentProps {
    authentication?: IAuthentication;
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    dependent: IDependentBase;
    member: IMember;
    monthly_fee: IMonthlyFee
}