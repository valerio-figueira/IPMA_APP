import winston from "winston";
import * as path from 'path';
import { Request, Response } from "express";
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






const prepareLoggerMessage = (req: Request, res: Response, options: any) => {
    const message = [
        `Action: ${req.method}`,
        `Host: ${req.hostname}`,
        `Endpoint: ${req.baseUrl}`,
        `Path: ${req.path}`,
        `Response Status: ${res.statusCode}`,
        `Session ID: ${req.sessionID}`
    ]

    if (req.originalUrl === '/api/v1/quotes/random') return null;
    if (options.username) message.push(`Username: ${options.username}`);
    if (options.ip) message.push(`Remote IP Address: ${options.ip}`);
    if (options.country) message.push(`Country: ${options.country}`);
    if (options.city) message.push(`City: ${options.city}`);
    if (req.path === '/login') {
        const user = req.body.username
        message.push(res.statusCode === 200 ? `Login efetuado: ${user}` : `Tentativa de Login: ${user}`)
    }
    if (res.statusCode >= 400) { }

    return message
}



export const loggerMessage = async (req: Request, res: Response) => {
    const remoteIpAddress = req.ip
    const decodedToken = JWT.getToken(req)
    const username = decodedToken ? decodedToken.user.username : null

    // const response = await axios.get(`https://ipinfo.io/${remoteIpAddress}/json`)
    // const data = response.data;

    // Adicione informações de geolocalização ao objeto de solicitação (req)
    /*const geolocation = {
        ip: data.ip,
        country: data.country,
        region: data.region,
        city: data.city,
        loc: data.loc,  // latitude e longitude
    }*/

    const message = prepareLoggerMessage(req, res, {
        ip: remoteIpAddress,
        username
    })

    if (!message) return
    if (req.path === '/login') return logger('info', 'login.log').info(message)
    if (res.statusCode >= 200 && res.statusCode < 300) return logger('info', 'server.log').info(message);
    if (res.statusCode >= 400) return logger('error', 'error.log').error(message);
}

export default logger