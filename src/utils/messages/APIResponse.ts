import IAPIResponse from "../../interfaces/IAPIResponse"


const APIResponse: IAPIResponse = {
    Success: {
        STATUS: 200,
        MESSAGE: 'Operação bem-sucedida'
    },
    Created: {
        STATUS: 201,
        MESSAGE: 'Recurso criado com sucesso'
    },
    NoContent: {
        STATUS: 204,
        MESSAGE: 'Nenhum conteúdo encontrado'
    },
    BadRequest: {
        STATUS: 400,
        MESSAGE: 'Solicitação inválida'
    },
    Unauthorized: {
        STATUS: 401,
        MESSAGE: 'Acesso não autorizado'
    },
    Forbidden: {
        STATUS: 403,
        MESSAGE: 'Acesso proibido'
    },
    NotFound: {
        STATUS: 404,
        MESSAGE: 'Não foi possível encontrar o recurso solicitado'
    },
    Conflict: {
        STATUS: 409,
        MESSAGE: 'Conflito na solicitação'
    },
    ServerError: {
        STATUS: 500,
        MESSAGE: 'Ocorreu um erro interno no servidor'
    }
}

export default APIResponse