import ISocialSecurityTeam from "../interfaces/ISocialSecurityTeam";

class SocialSecurityTeamEntity implements ISocialSecurityTeam {
    sst_member_id?: number;
    user_id: number;
    role: string;
    created_at?: Date;

    constructor(body: ISocialSecurityTeam) {
        this.sst_member_id = body.sst_member_id;
        this.user_id = body.user_id;
        this.role = body.role;
        this.created_at = body.created_at;
    }
}

export default SocialSecurityTeamEntity;