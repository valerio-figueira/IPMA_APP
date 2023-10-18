import { IUser } from "../interfaces/IUser";


class UserEntity {
    user_id?: number;
    name: string;
    gender: 'MASCULINO' | 'FEMININO' | 'OUTRO';
    marital_status: string | null;
    birth_date: Date | null;
    father_name: string | null;
    mother_name: string | null;
    created_at?: Date;

    constructor(user: IUser) {
        this.user_id = user.user_id;
        this.name = user.name;
        this.gender = user.gender;
        this.marital_status = user.marital_status;
        this.birth_date = user.birth_date;
        this.father_name = user.father_name;
        this.mother_name = user.mother_name;
        this.created_at = user.created_at;
    }
}

export default UserEntity