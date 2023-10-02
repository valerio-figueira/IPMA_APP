import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from 'cors';
import BodyParser, { json } from 'body-parser';
import session from "express-session";
import fileUpload from "express-fileupload";

// CONFIG
import Cors from "./config/Cors";
import Session from "./config/Session";

// ROUTES
import HolderRoutes from './routes/HolderRoutes';
import DependentRoutes from './routes/DependentRoutes';
import MemberRoutes from './routes/MemberRoutes'
import AgreementRoutes from './routes/AgreementRoutes'
import MonthlyFeeRoutes from './routes/MonthlyFeeRoutes'
import DoctorRoutes from './routes/DoctorRoutes'
import AuthenticationRoutes from './routes/AuthenticationRoutes'
import AccessHierarchyRoutes from './routes/AccessHierarchyRoutes'

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
        this.APP.use('/api/v1/holders', HolderRoutes)
        this.APP.use('/api/v1/dependents', DependentRoutes)
        this.APP.use('/api/v1/members', MemberRoutes)
        this.APP.use('/api/v1/agreements', AgreementRoutes)
        this.APP.use('/api/v1/monthly-fee', MonthlyFeeRoutes)
        this.APP.use('/api/v1/doctors', DoctorRoutes)
        this.APP.use('/api/v1/authentications', AuthenticationRoutes)
        this.APP.use('/api/v1/access-hierarchy', AccessHierarchyRoutes)
    }

    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}