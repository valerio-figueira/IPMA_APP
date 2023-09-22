import express, { Application, Request, Response, NextFunction } from "express";
import path from "path";
import cors from 'cors';
import BodyParser, { json } from 'body-parser';
import session from "express-session";

// CONFIG
import Cors from "./config/Cors";
import Session from "./config/Session";

// ROUTES
import HolderRoutes from './routes/HolderRoutes';
import DependentRoutes from './routes/DependentRoutes';
import LoginRoutes from './routes/LoginRoutes';
import ContractRegistryRoutes from './routes/ContractRegistryModelRoutes'
import BusinessContractRoutes from './routes/BusinessContractRoutes'
import BillingRoutes from './routes/BillingRoutes'

declare module 'express-session' {
    interface SessionData { user: string; }
}

require("dotenv").config();

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

        this.APP.use(express.static(path.join("public")));
    }

    private isAuthenticated(req: Request, res: Response, next: NextFunction) {
        console.log(req.session.user)
        if (req.session.user) next()
        else res.redirect('/')
    }

    private setupRoutes() {
        this.APP.use('/login', LoginRoutes)
        this.APP.get('/', this.rootHandler)
        this.APP.use('/api/v1/holders', HolderRoutes)
        this.APP.use('/api/v1/dependents', DependentRoutes)
        this.APP.use('/api/v1/contract-registry', ContractRegistryRoutes)
        this.APP.use('/api/v1/business-contract', BusinessContractRoutes)
        this.APP.use('/api/v1/billings', BillingRoutes)
    }

    private rootHandler(req: Request, res: Response) {
        res.status(200).json({ message: 'Hello world!' })
    }
}