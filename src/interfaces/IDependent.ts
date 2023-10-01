import { IContact, IDocument, ILocation, IUser } from "./IUser";

export interface IDependentBase {
    dependent_id?: number;
    user_id?: number;
    holder_id: number;
    relationship_degree: string | null;
}

export interface IDependent {
    user: IUser;
    contact: IContact;
    location: ILocation;
    document: IDocument;
    dependent: IDependentBase;
}