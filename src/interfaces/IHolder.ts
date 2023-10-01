import { IContact, IDocument, ILocation, IUser } from "./IUser";
import UserModel from "../models/user/UserModel";
import DocumentModel from "../models/user/DocumentModel";
import ContactModel from "../models/user/ContactModel";
import LocationModel from "../models/user/LocationModel";

export interface IHolderBase {
    holder_id?: number;
    user_id?: number;
    registration_number?: number | null;
    status: 'Active' | 'Retired' | 'On Leave';
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
    nome: 'string';
    sexo: 'string' | null;
    estado_civil: 'string' | null;
    data_nasc: 'string' | null;
    nome_pai: 'string' | null;
    nome_mae: 'string' | null;
    celular_1: 'string' | null;
    celular_2: 'string' | null;
    tel_residencial: 'string' | null;
    email: 'string' | null;
    endereco: 'string' | null;
    numero: 'number' | null;
    bairro: 'string' | null;
    cidade: 'string' | null;
    estado: 'string' | null;
    cpf: 'string';
    identidade: 'string';
    data_expedicao: 'string' | null;
    cartao_saude: 'string' | null;
    status: 'string' | null;
    matricula: 'number' | null;
    [key: string]: string | number | null
};