import { IContact, IDocument, ILocation, IUser } from "./IUser";

export interface IDependentBase {
    id_dependente: number;
    id_usuario: number;
    id_titular: number;
    grau_parentesco: string | null;
}

export interface IDependent {
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    titular: IDependentBase;
}