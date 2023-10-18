import { IDependentBase } from "../interfaces/IDependent";

export class DependentEntity implements IDependentBase {
    dependent_id?: number;
    user_id?: number;
    holder_id: number;
    relationship_degree: string | null;
    created_at?: Date;

    constructor(data: IDependentBase) {
        this.dependent_id = data.dependent_id;
        this.user_id = data.user_id;
        this.holder_id = data.holder_id;
        this.relationship_degree = data.relationship_degree;
        this.created_at = data.created_at;
    }
}

export default DependentEntity