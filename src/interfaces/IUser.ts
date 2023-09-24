import { IDependentBase } from "./IDependent";
import { IHolderBase } from "./IHolder";

export interface IUser {
    id_usuario?: number;
    nome: string;
    sexo: 'Masculino' | 'Feminino' | 'Outro';
    estado_civil: string | null;
    data_nasc: Date | null;
    nome_pai: string | null;
    nome_mae: string | null;
    data_cadastro?: Date;
}

export interface IContact {
    id_contato?: number;
    id_usuario?: number;
    celular_1: string | null;
    celular_2: string | null;
    tel_residencial: string | null;
    email: string | null;
}

export interface ILocation {
    id_localizacao?: number;
    id_usuario?: number;
    endereco: string | null;
    numero: number | null;
    bairro: string | null;
    cidade: string | null;
    estado: string | null;
}

export interface IDocument {
    id_documento?: number;
    id_usuario?: number;
    cpf: string;
    identidade: string;
    data_expedicao: Date | null;
    cartao_saude: string | null;
}

export interface IUserAttributes {
    user: IUser;
    document: IDocument;
    contact: IContact;
    location: ILocation;
    holder?: IHolderBase;
    dependent?: IDependentBase;
    [key: string]: any;
}