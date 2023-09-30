import IAuthentication from "../interfaces/IAuthentication";

export class AuthenticationSchema {
    id_autenticacao?: number;
    id_usuario?: number;
    id_login: string;
    senha_autenticacao: string;
    foto_usuario: string;
    grau_hierarquico: 'SUPERUSUARIO' | 'ADMINISTRADOR' | 'USUARIO_COMUM';

    constructor(body: IAuthentication) {
        this.id_autenticacao = body.id_autenticacao;
        this.id_usuario = body.id_usuario;
        this.id_login = body.id_login;
        this.senha_autenticacao = body.senha_autenticacao;
        this.foto_usuario = body.foto_usuario;
        this.grau_hierarquico = body.grau_hierarquico;
    }
}