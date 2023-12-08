import Database from "../db/Database";
import AppointmentRepository from "../repositories/AppointmentRepository";
import IAppointment from "../interfaces/IAppointment";


class AppointmentService {
    private appointmentRepository: AppointmentRepository

    constructor(db: Database) {
        this.appointmentRepository = new AppointmentRepository(db)
    }




    async Create(query: IAppointment) {
        return this.appointmentRepository.Create(query)
    }




    async ReadAll(query: Record<string, any>) {
        return this.appointmentRepository.ReadAll(query)
    }




    async ReadOne(appointment_id: string | number) {
        return this.appointmentRepository.ReadOne(appointment_id)
    }




    async Update(query: IAppointment) {
        return this.appointmentRepository.Update(query)
    }




    async Delete(appointment_id: string | number) {
        return this.appointmentRepository.Delete(appointment_id)
    }
}


export default AppointmentService