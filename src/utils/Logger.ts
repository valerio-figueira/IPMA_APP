import winston from "winston";
import * as path from 'path';
import { Request } from "express";
import JWT from "../authentication/JWT";



const logger = (level: string, filename: string) => {
    return winston.createLogger({
        level, // Nível mínimo de log a ser exibido (pode ser 'info', 'warn', 'error', etc.)
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
        ),
        transports: [
            new winston.transports.Console(), // Exibe logs no console
            new winston.transports.File({ dirname: path.join(__dirname, '../logs'), filename })
        ]
    })
}



export const loggerMessage = (req: Request) => {
    const decodedToken = JWT.getToken(req)
    const message = `Action: ${req.method}
    URL: ${req.url}
    Username: ${decodedToken ? decodedToken.user.username : null}`

    logger('info', 'server.log').info(message)
}

export default logger