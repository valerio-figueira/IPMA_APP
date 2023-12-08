import Database from "../db/Database";
import IAppointment from "../interfaces/IAppointment";
import Models from "../models";


class AppointmentRepository {
    private db: Database
    private models: Models

    constructor(db: Database) {
        this.db = db
        this.models = this.db.models
    }




    async Create(query: IAppointment) {
        return this.models.Appointment.create(query)
    }





    async BulkCreate(query: IAppointment[]) {
        // this.models.Appointment.bulkCreate(query)
        return { message: 'Ok...' }
    }




    async ReadAll(query: Record<string, any>) {
        const whereClause: Record<string, any> = {}

        return this.models.Appointment.findAll({
            where: whereClause
        })
    }




    async ReadOne(appointment_id: string | number) {
        return this.models.Appointment.findAll({
            where: { appointment_id }
        })
    }




    async Update(query: IAppointment) {
        const { appointment_id } = query
        return this.models.Appointment.update(query, {
            where: { appointment_id }
        })
    }




    async Delete(appointment_id: string | number) {
        return this.models.Appointment.destroy({
            where: { appointment_id }
        })
    }

}


export default AppointmentRepository