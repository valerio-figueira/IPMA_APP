import IAuthentication from "../interfaces/IAuthentication";

class AuthenticationEntity {
    authentication_id?: number;
    user_id?: number;
    username: string;
    password: string;
    user_photo: string;
    hierarchy_id: number;
    created_at?: Date;

    constructor(body: IAuthentication) {
        this.authentication_id = body.authentication_id;
        this.user_id = body.user_id;
        this.username = body.username;
        this.password = body.password;
        this.user_photo = body.user_photo;
        this.hierarchy_id = body.hierarchy_id;
        this.created_at = body.created_at;
    }
}

export default AuthenticationEntity