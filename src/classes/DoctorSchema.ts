import { IDoctor } from "../interfaces/IDoctor"

export default class DoctorSchema {
    provider_code: number
    doctor_name: string
    speciality: string
    location?: string | null
    zip_code?: string | null
    address?: string | null
    neighborhood?: string | null
    phone_number?: string | null
    created_at?: Date

    constructor(body: IDoctor) {
        this.provider_code = body.provider_code
        this.doctor_name = body.doctor_name
        this.speciality = body.speciality
        this.location = body.location
        this.zip_code = body.zip_code
        this.address = body.address
        this.neighborhood = body.neighborhood
        this.phone_number = body.phone_number
        this.created_at = body.created_at
    }
}