import { IContact, IDocument, ILocation, IUser } from "./IUser";
import UserModel from "../models/user/UserModel";
import DocumentModel from "../models/user/DocumentModel";
import ContactModel from "../models/user/ContactModel";
import LocationModel from "../models/user/LocationModel";

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

export interface IHolderAttributes {
  user: UserModel;
  document: DocumentModel;
  contact: ContactModel;
  location: LocationModel;
  [key: string]: UserModel | DocumentModel | ContactModel | LocationModel;
}

export interface IHolderRequest {
    name: 'string';
    gender: 'string' | null;
    marital_status: 'string' | null;
    birth_date: 'string' | null;
    father_name: 'string' | null;
    mother_name: 'string' | null;
    phone_number: 'string' | null;
    residential_phone: 'string' | null;
    email: 'string' | null;
    address: 'string' | null;
    number: 'number' | null;
    neighborhood: 'string' | null;
    city: 'string' | null;
    zipcode: 'string' | null;
    state: 'string' | null;
    cpf: 'string';
    identity: 'string';
    issue_date: 'string' | null;
    health_card: 'string' | null;
    status: 'ATIVO(A)' | 'APOSENTADO(A)' | 'LICENÇA';
    subscription_number: 'number' | null;
    [key: string]: string | number | null
};