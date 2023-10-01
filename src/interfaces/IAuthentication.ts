export default interface IAuthentication {
    authentication_id?: number;
    user_id?: number;
    hierarchy_id: number;
    username: string;
    password: string;
    user_photo: string;
}