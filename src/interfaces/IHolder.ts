import { IContact, IDocument, ILocation, IUser } from "./IUser";
import IAuthentication from "./IAuthentication";
import IMember from "./IMember";

export interface IHolderBase {
    holder_id?: number;
    user_id?: number;
    subscription_number?: number | null;
    status: 'ATIVO(A)' | 'APOSENTADO(A)' | 'LICENÇA';
    created_at?: Date
}

export interface IHolder {
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    holder: IHolderBase;
}

export interface IHolderProps {
    authentication?: IAuthentication;
    holder: IHolderBase;
    user: IUser;
    document: IDocument;
    contact: IContact;
    location: ILocation;
    member?: IMember
}