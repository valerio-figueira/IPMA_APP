export default interface IAPIResponse {
    Success: {
        STATUS: number;
        MESSAGE: string;
    },
    Created: {
        STATUS: number;
        MESSAGE: string;
    },
    NoContent: {
        STATUS: number;
        MESSAGE: string;
    },
    BadRequest: {
        STATUS: number;
        MESSAGE: string;
    },
    Unauthorized: {
        STATUS: number;
        MESSAGE: string;
    },
    Forbidden: {
        STATUS: number;
        MESSAGE: string;
    },
    NotFound: {
        STATUS: number;
        MESSAGE: string;
    },
    Conflict: {
        STATUS: number;
        MESSAGE: string;
    },
    ServerError: {
        STATUS: number;
        MESSAGE: string;
    }
}