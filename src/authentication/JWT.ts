import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthenticationModel from "../models/AuthenticationModel";
require("dotenv").config();

type TUser = { user_id: number; username: string; role: string; };

declare global {
    namespace Express {
        interface Request { user?: TUser }
    }
}

export default class JWT {
    private static SECRET_KEY = (process.env.SECRET_KEY as string)
    static AllUsersAccess = ['SUPERUSUARIO', 'ADMINISTRADOR', 'FUNCIONARIO', 'USUARIO_COMUM']
    static ADMAccess = ['SUPERUSUARIO', 'ADMINISTRADOR']
    static ROOTAccess = ['SUPERUSUARIO']

    static async verifyToken(req: Request, res: Response, next: NextFunction) {
        const token = req.header('x-auth-token');

        if (!token) {
            return res.status(401).json({ message: 'Token não fornecido. Autenticação negada.' });
        }

        try {
            const decoded = jwt.verify(token, this.SECRET_KEY) as { user: TUser };
            req.user = decoded.user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Token inválido. Autenticação negada.' });
        }
    }

    static isAuthorized(permissions: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            await this.verifyToken(req, res, next)
            const user = req.user;

            if (user && permissions.includes(user.role)) {
                next();
            } else {
                res.status(403).json({ message: 'Acesso proibido. Você não tem permissão para acessar esta rota.' });
            }
        };
    }

    static async Login(req: Request, res: Response) {
        const { username, password } = req.body;

        const userFound = await this.findUserInDatabase(username, password)

        if (username === userFound?.id_login && password === userFound?.senha_autenticacao) {
            const user = {
                user_id: userFound!.id_usuario,
                username: userFound!.id_login,
                role: userFound!.grau_hierarquico
            };
            const token = jwt.sign({ user }, this.SECRET_KEY, { expiresIn: '1h' });

            res.json({ token });
        } else {
            res.status(401).json({ message: 'Credenciais inválidas. Autenticação negada.' });
        }
    }

    static async findUserInDatabase(username: string, password: string) {
        return AuthenticationModel.findOne({
            where: {
                id_login: username,
                senha_autenticacao: password
            }, raw: true
        })
    }

}