import { IUser, IContact, IDocument, ILocation, IUserAttributes } from "../interfaces/IUser";
import { IHolderBase } from "../interfaces/IHolder";

export class UserAttributes {
    user: User;
    document: Document;
    contact: Contact;
    location: Location;
    holder?: IHolderBase;

    constructor(attributes: IUserAttributes) {
        this.user = new User(attributes.user);
        this.document = new Document(attributes.document);
        this.contact = new Contact(attributes.contact);
        this.location = new Location(attributes.location);
    }

    addHolder(holder: IHolderBase) {
        this.holder = holder;
    }
}

export class User {
    id_usuario?: number;
    nome: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    estado_civil: string | null;
    data_nasc: Date | null;
    nome_pai: string | null;
    nome_mae: string | null;
    data_cadastro: Date;

    constructor(user: IUser) {
        this.nome = user.nome;
        this.sexo = user.sexo;
        this.estado_civil = user.estado_civil;
        this.data_nasc = user.data_nasc;
        this.nome_pai = user.nome_pai;
        this.nome_mae = user.nome_mae;
        this.data_cadastro = user.data_cadastro;
    }
}

export class Contact {
    id_contato?: number;
    id_usuario?: number;
    celular_1: string | null;
    celular_2: string | null;
    tel_residencial: string | null;
    email: string | null;

    constructor(contact: IContact) {
        this.celular_1 = contact.celular_1;
        this.celular_2 = contact.celular_2;
        this.tel_residencial = contact.tel_residencial;
        this.email = contact.email;
    }
}

export class Document {
    id_documento?: number;
    id_usuario?: number;
    cpf: string;
    identidade: string;
    data_expedicao: Date | null;
    cartao_sus: string | null;

    constructor(document: IDocument) {
        this.cpf = document.cpf;
        this.identidade = document.identidade;
        this.data_expedicao = document.data_expedicao;
        this.cartao_sus = document.cartao_sus;
    }
}

export class Location {
    id_localizacao?: number;
    id_usuario?: number;
    endereco: string | null;
    numero: number | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;

    constructor(location: ILocation) {
        this.endereco = location.endereco;
        this.numero = location.numero;
        this.bairro = location.bairro;
        this.cidade = location.cidade;
        this.estado = location.estado;
    }
}

