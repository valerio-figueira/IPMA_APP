import { IContact } from "../interfaces/IUser";


export class ContactEntity {
    contact_id?: number;
    user_id?: number;
    phone_number: string | null;
    residential_phone: string | null;
    email: string | null;
    created_at?: Date;

    constructor(contact: IContact) {
        this.contact_id = contact.contact_id
        this.user_id = contact.user_id;
        this.phone_number = contact.phone_number;
        this.residential_phone = contact.residential_phone;
        this.email = contact.email;
        this.created_at = contact.created_at;
    }
}


export default ContactEntity