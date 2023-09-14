import { IContact, IDocument, ILocation, IUser } from "./IUser";

export interface IHolderBase {
    id_titular?: number;
    id_usuario?: number;
    matricula?: number | null;
    status: 'Ativo' | 'Aposentado' | 'LIP';
}

export interface IHolder {
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    holder: IHolderBase;
}