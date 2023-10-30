import JWT from "./JWT";

class AccessPermission {
    static Create = JWT.isAuthorized(['Root', 'Administrator'])
    static ReadAll = JWT.isAuthorized(['Root', 'Administrator', 'Advanced_Employee', 'Common_Employee'])
    static ReadOne = JWT.isAuthorized(['Root', 'Administrator', 'Advanced_Employee', 'Common_Employee'])
    static Update = JWT.isAuthorized(['Root', 'Administrator', 'Advanced_Employee'])
    static Delete = JWT.isAuthorized(['Root'])
}

export default AccessPermission