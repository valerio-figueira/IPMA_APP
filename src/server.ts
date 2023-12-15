import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";
import path from "path";
import cors from 'cors';
import https from 'https'
import http from 'http';
import BodyParser from 'body-parser';
import session from "express-session";
import fileUpload from "express-fileupload";
import Database from "./db/Database";
import 'reflect-metadata';

// CONFIG
import Cors from "./config/Cors";
import Session from "./config/Session";
import Certificate from "./config/Certificate";

// ROUTES
import RegisterRoutes from "./routes/RegisterRoutes";
import { loggerMessage } from "./utils/Logger";


export default class Server {
    APP: Application
    PORT_HTTP: number
    PORT_HTTPS: number
    database: Database
    routes: RegisterRoutes


    constructor(PORT_HTTP: number, PORT_HTTPS: number) {
        this.APP = express()
        this.PORT_HTTP = PORT_HTTP
        this.PORT_HTTPS = PORT_HTTPS
        this.database = new Database()
        this.routes = new RegisterRoutes(this.APP, this.database)
        this.setupMiddleware()
        this.initializeRoutes()
    }


    public start() {
        https.createServer(Certificate.config(__dirname), this.APP)
            .listen(this.PORT_HTTPS, () => console.log(`Server HTTPS running on port ${this.PORT_HTTPS}`))

        http.createServer(this.APP)
            .listen(this.PORT_HTTP, () => console.log(`Server HTTP running on port ${this.PORT_HTTP}`))
    }


    private setupMiddleware() {
        this.APP.use(cors(Cors.config))

        this.APP.use(BodyParser.urlencoded({ extended: false }))
        this.APP.use(BodyParser.json())

        this.APP.use(session(Session.config))
        this.APP.use(helmet())
        this.APP.use(fileUpload())

        this.APP.use(express.static(path.join("public")))
        this.APP.use(this.logger)
    }


    private logger(req: Request, res: Response, next: NextFunction) {
        loggerMessage(req, res)
        next()
    }


    private initializeRoutes() {
        this.APP.get('/', this.rootHandler)
        this.routes.initialize()
    }


    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}