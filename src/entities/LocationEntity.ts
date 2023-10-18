import { ILocation } from "../interfaces/IUser";

export class LocationEntity {
    location_id?: number;
    user_id?: number;
    address: string | null;
    number: number | null;
    neighborhood: string | null;
    city: string | null;
    zipcode: string | null;
    state: string | null;
    created_at?: Date;

    constructor(location: ILocation) {
        this.location_id = location.location_id
        this.user_id = location.user_id;
        this.address = location.address;
        this.number = location.number;
        this.neighborhood = location.neighborhood;
        this.city = location.city;
        this.zipcode = location.zipcode;
        this.state = location.state;
        this.created_at = location.created_at;
    }
}

export default LocationEntity