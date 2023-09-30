export default interface IAuthentication {
    id_autenticacao?: number;
    id_usuario?: number;
    id_login: string;
    senha_autenticacao: string;
    foto_usuario: string;
    grau_hierarquico: 'SUPERUSUARIO' | 'ADMINISTRADOR' | 'USUARIO_COMUM';
}