import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import AuthenticationModel from "../models/AuthenticationModel";
import AccessHierarchyModel from "../models/AccessHierarchyModel";
import Database from "../db/Database";
import CustomError from "../utils/CustomError";
require("dotenv").config();

type TUser = { user_id: number; username: string; role: string };

declare global {
  namespace Express {
    interface Request {
      user?: TUser;
    }
  }
}

export default class JWT {
  private static SECRET_KEY = process.env.SECRET_KEY as string;


  static getToken(req: Request) {
    const header = req.headers['authorization']

    if (!header) return null

    const token = header.split(' ')[1]

    return jwt.verify(token, this.SECRET_KEY) as { user: TUser }
  }


  static verifyToken(req: Request) {
    const header = req.headers['authorization']

    if (!header) throw new CustomError('Token não fornecido. Autenticação negada.', 401)

    const token = header.split(' ')[1]

    try {
      const decoded = jwt.verify(token, this.SECRET_KEY) as { user: TUser };
      req.user = decoded.user;
      return
    } catch (error) {
      throw new CustomError('Token inválido. Autenticação negada.', 401)
    }
  }




  static isAuthorized(permissions: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        this.verifyToken(req);
        const user = req.user;

        if (!(user && permissions.includes(user.role))) {
          const message = 'Acesso proibido. Você não tem permissão para acessar esta rota.'
          throw new CustomError(message, 403)
        }

        next()
      } catch (error: any) {
        const message = { error: 'Token inválido. Autenticação negada.' }
        res.status(error.status || 401).json({ error: error.message || message });
      }
    }
  }




  static async Login(req: Request, res: Response, db: Database) {
    const { username, password } = req.body;

    const userFound = await this.findUserInDatabase(username, db)

    if (!userFound) throw new CustomError('Usuário não encontrado.', 400)
    if (!userFound.hierarchy) {
      throw new CustomError('Falha ao processar o nível de permissão.', 400)
    }

    if (password !== userFound.password) {
      throw new CustomError('Credenciais inválidas. Autenticação negada.', 401)
    }

    if (!userFound.user_photo) userFound.user_photo = 'http://localhost:9292/imgs/blank-profile.webp'

    const user = {
      user_id: userFound.user_id,
      username: userFound.username,
      photo: userFound.user_photo,
      created_at: userFound.created_at,
      role: userFound.hierarchy.level_name,
    };

    // RETURN TOKEN
    return { token: jwt.sign({ user }, this.SECRET_KEY, { expiresIn: "15m" }) }
  }





  static async findUserInDatabase(username: string, db: Database) {
    return AuthenticationModel.INIT(db.sequelize).findOne({
      where: {
        username
      },
      include: [
        {
          model: AccessHierarchyModel,
          as: "hierarchy",
        },
      ],
      raw: true,
      nest: true,
    });
  }
}
