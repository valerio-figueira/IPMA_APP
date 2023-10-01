import { IUser, IContact, IDocument, ILocation, IUserAttributes } from "../interfaces/IUser";
import { IHolderBase } from "../interfaces/IHolder";
import { Holder } from "./HolderSchema";
import { IDependentBase } from "../interfaces/IDependent";
import { Dependent } from "./DependentSchema";
import IMember from "../interfaces/IMember";
import MemberSchema from "./MemberSchema";
import IAuthentication from "../interfaces/IAuthentication";

export class UserAttributes {
    authentication?: IAuthentication;
    user: User;
    document: Document;
    contact: Contact;
    location: Location;
    holder?: IHolderBase;
    dependent?: IDependentBase;
    contract?: IMember;

    constructor(attributes: IUserAttributes) {
        this.user = new User(attributes.user);
        this.document = new Document(attributes.document);
        this.contact = new Contact(attributes.contact);
        this.location = new Location(attributes.location);
    }

    addHolder(holder: IHolderBase) {
        this.holder = new Holder(holder)
    }

    addDependent(dependent: IDependentBase) {
        this.dependent = new Dependent(dependent)
    }

    addContract(contract: IMember) {
        this.contract = new MemberSchema(contract)
    }

    addAuthentication(authentication: IAuthentication) {
        this.authentication = authentication
    }
}

export class User {
    user_id?: number;
    name: string;
    gender: 'Male' | 'Female' | 'Other';
    marital_status: string | null;
    birth_date: Date | null;
    father_name: string | null;
    mother_name: string | null;
    data_cadastro?: Date;

    constructor(user: IUser) {
        this.user_id = user.user_id;
        this.name = user.name;
        this.gender = user.gender;
        this.marital_status = user.marital_status;
        this.birth_date = user.birth_date;
        this.father_name = user.father_name;
        this.mother_name = user.mother_name;
    }
}

export class Contact {
    contact_id?: number;
    user_id?: number;
    phone_number: string | null;
    residential_phone: string | null;
    email: string | null;

    constructor(contact: IContact) {
        this.contact_id = contact.contact_id
        this.user_id = contact.user_id;
        this.phone_number = contact.phone_number;
        this.residential_phone = contact.residential_phone;
        this.email = contact.email;
    }
}

export class Document {
    document_id?: number;
    user_id?: number;
    cpf: string;
    identity: string;
    issue_date: Date | null;
    health_card: string | null;

    constructor(document: IDocument) {
        this.user_id = document.user_id;
        this.cpf = document.cpf;
        this.identity = document.identity;
        this.issue_date = document.issue_date;
        this.health_card = document.health_card;
    }
}

export class Location {
    location_id?: number;
    user_id?: number;
    address: string | null;
    number: number | null;
    neighborhood: string | null;
    city: string | null;
    zipcode: string | null;
    state: string | null;

    constructor(location: ILocation) {
        this.location_id = location.location_id
        this.user_id = location.user_id;
        this.address = location.address;
        this.number = location.number;
        this.neighborhood = location.neighborhood;
        this.city = location.city;
        this.zipcode = location.zipcode;
        this.state = location.state;
    }
}

