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
import RegisterRoutes from "./routes/RegisterRoutes";

import JWT from "./authentication/JWT";
import Database from "./db/Database";

declare module 'express-session' {
    interface SessionData { user: string; }
}

export default class Server {
    APP: Application;
    PORT: number;
    database: Database
    routes: RegisterRoutes

    constructor(PORT: number) {
        this.APP = express();
        this.PORT = PORT;
        this.database = new Database();
        this.routes = new RegisterRoutes(this.APP, this.database)
        this.setupMiddleware();
        this.setupRoutes();
    }

    public start() {
        const message = `Server running on port ${this.PORT}`
        this.APP.listen(this.PORT, () => console.log(message));
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
        this.routes.initialize()
    }

    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}