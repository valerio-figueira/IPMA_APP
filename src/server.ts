import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from 'cors';
import BodyParser, { json } from 'body-parser';
import session from "express-session";
import fileUpload from "express-fileupload";
import 'reflect-metadata'

// CONFIG
import Cors from "./config/Cors";
import Session from "./config/Session";

// ROUTES
import RegisterRoutes from "./utils/RegisterRoutes";

import JWT from "./authentication/JWT";

declare module 'express-session' {
    interface SessionData { user: string; }
}

export default class Server {
    APP: Application;
    PORT: number;

    constructor(PORT: number) {
        this.APP = express();
        this.PORT = PORT;
        this.setupMiddleware();
        this.setupRoutes();
    }

    public start() {
        this.APP.listen(this.PORT, () => {
            console.log("Server running on port " + this.PORT)
        });
    }

    private setupMiddleware() {
        this.APP.use(cors(Cors.config));

        this.APP.use(BodyParser.urlencoded({ extended: false }));
        this.APP.use(BodyParser.json());

        this.APP.use(session(Session.config))
        this.APP.use(fileUpload())

        this.APP.use(express.static(path.join("public")));
    }

    private isAuthenticate(req: Request, res: Response, next: NextFunction) {
        JWT.verifyToken(req, res, next)
    }

    private setupRoutes() {
        this.APP.get('/', this.rootHandler)
        RegisterRoutes(this.APP)
    }

    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}