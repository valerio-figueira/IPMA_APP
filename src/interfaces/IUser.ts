import IMember from "./IMember";
import { IDependentBase } from "./IDependent";
import { IHolderBase } from "./IHolder";
import ISocialSecurityTeam from "./ISocialSecurityTeam";

export interface IUser {
    user_id?: number;
    name: string;
    gender: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    marital_status: string | null;
    birth_date: Date | null;
    father_name: string | null;
    mother_name: string | null;
    created_at?: Date;
}

export interface IContact {
    contact_id?: number;
    user_id?: number;
    phone_number: string | null;
    residential_phone: string | null;
    email: string | null;
    created_at?: Date;
}

export interface ILocation {
    location_id?: number;
    user_id?: number;
    address: string | null;
    number: number | null;
    neighborhood: string | null;
    city: string | null;
    zipcode: string | null;
    state: string | null;
    created_at?: Date;
}

export interface IDocument {
    document_id?: number;
    user_id?: number;
    cpf: string;
    identity: string;
    issue_date: Date | null;
    health_card: string | null;
    created_at?: Date;
}

export interface IUserAttributes {
    user: IUser;
    document: IDocument;
    contact: IContact;
    location: ILocation;
    sstEntity?: ISocialSecurityTeam;
    holder?: IHolderBase;
    dependent?: IDependentBase;
    member?: IMember
    [key: string]: any;
}