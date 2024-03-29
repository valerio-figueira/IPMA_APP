import { Application } from "express";
import AccessHierarchyRoutes from "./AccessHierarchyRoutes";
import AgreementRoutes from "./AgreementRoutes";
import AuthenticationRoutes from "./AuthenticationRoutes";
import DependentRoutes from "./DependentRoutes";
import DoctorRoutes from "./DoctorRoutes";
import HolderRoutes from "./HolderRoutes";
import MemberRoutes from "./MemberRoutes";
import MonthlyFeeRoutes from "./MonthlyFeeRoutes";
import SocialSecurityTeamRoutes from "./SocialSecurityTeamRoutes";
import AppointmentRoutes from "./AppointmentRoutes";
import Database from "../db/Database";
import UserRoutes from "./UserRoutes";
import DatabaseRoutes from "./DatabaseRoutes";
import QuoteRoutes from "./QuoteRoutes";
import ReportRoutes from "./ReportRoutes";
import FormRoutes from "./FormRoutes";
import SecurityKeyRoutes from "./SecurityKeyRoutes";
import InstallmentRoutes from "./InstallmentRoutes";
import PaymentRoutes from "./PaymentRoutes";

class RegisterRoutes {
    private APP: Application
    private database: Database
    private routes

    constructor(app: Application, db: Database) {
        this.APP = app
        this.database = db
        this.routes = {
            AccessHierarchy: new AccessHierarchyRoutes(this.database).router,
            Agreement: new AgreementRoutes(this.database).router,
            Authentication: new AuthenticationRoutes(this.database).router,
            Holder: new HolderRoutes(this.database).router,
            Dependent: new DependentRoutes(this.database).router,
            Doctor: new DoctorRoutes(this.database).router,
            Member: new MemberRoutes(this.database).router,
            MonthlyFee: new MonthlyFeeRoutes(this.database).router,
            SSTMember: new SocialSecurityTeamRoutes(this.database).router,
            User: new UserRoutes(this.database).router,
            Database: new DatabaseRoutes(this.database).router,
            Quote: new QuoteRoutes(this.database).router,
            ReportRoutes: new ReportRoutes(this.database).router,
            AppointmentRoutes: new AppointmentRoutes(this.database).router,
            FormRoutes: new FormRoutes(this.database).router,
            SecurityKeyRoutes: new SecurityKeyRoutes(this.database).router,
            InstallmentRoutes: new InstallmentRoutes(this.database).router,
            PaymentRoutes: new PaymentRoutes(this.database).router
        }
        // this.printRoutes()
    }

    initialize() {
        this.APP.use('/api/v1/access-hierarchy', this.routes.AccessHierarchy)
        this.APP.use('/api/v1/agreements', this.routes.Agreement)
        this.APP.use('/api/v1/authentications', this.routes.Authentication)
        this.APP.use('/api/v1/dependents', this.routes.Dependent)
        this.APP.use('/api/v1/doctors', this.routes.Doctor)
        this.APP.use('/api/v1/holders', this.routes.Holder)
        this.APP.use('/api/v1/members', this.routes.Member)
        this.APP.use('/api/v1/monthly-fee', this.routes.MonthlyFee)
        this.APP.use('/api/v1/social-security-team', this.routes.SSTMember)
        this.APP.use('/api/v1/users', this.routes.User),
        this.APP.use('/api/v1/database', this.routes.Database),
        this.APP.use('/api/v1/quotes', this.routes.Quote),
        this.APP.use('/api/v1/report', this.routes.ReportRoutes),
        this.APP.use('/api/v1/appointments', this.routes.AppointmentRoutes)
        this.APP.use('/api/v1/create-form', this.routes.FormRoutes)
        this.APP.use('/api/v1/security-key', this.routes.SecurityKeyRoutes)
        this.APP.use('/api/v1/installments', this.routes.InstallmentRoutes)
        this.APP.use('/api/v1/payments', this.routes.PaymentRoutes)
    }

    printRoutes() {
        const routes: Record<string, any>[] = []

        Object.entries(this.routes).forEach(([name, router]) => {
            router.stack.forEach((layer, i) => {
                routes.push({
                    Name: name,
                    Path: layer.route.path,
                    Methods: Object.keys(layer.route.methods).join(', ')
                })
            })
        })
        console.table(routes)
    }

    printSummaryRoutes() {
        const routeInfo = Object.entries(this.routes).map(([name, router]) => {
            const route = router.stack[0].route;
            return {
                Name: name,
                Path: route.path,
                Methods: Object.keys(route.methods).join(', ')
            };
        });
        console.table(routeInfo)
    }
}


export default RegisterRoutes