import CustomError from "../CustomError";
import { BadRequest } from "../messages/APIResponse";


const HTTPErrors = {
    BadRequest: new CustomError(BadRequest.MESSAGE, BadRequest.STATUS),
    UserIdRequired: new CustomError('É necessário a identificação de usuário', 400),
    NotChanged: new CustomError('Nenhum dado foi alterado', 400),
}


export const DBErrors = {
    DBAuthError: new CustomError('Erro ao conectar ao banco de dados', 500),
    DBSyncError: new CustomError('Erro ao sincronizar modelos com o banco de dados', 500),
    ClearDBError: new CustomError('Erro ao limpar o banco de dados', 500)
}


const PermissionError = {
    RootLevel: new CustomError('Não é permitido cadastrar com nível Root', 400),
    PermissionNotFound: new CustomError('Permissão de acesso não foi encontrada', 400),
    CommonUserRequired: new CustomError('Só é permitido acesso no níveç de usuário comum', 400),
}

export default HTTPErrors