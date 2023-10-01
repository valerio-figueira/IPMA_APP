import { IDependentBase } from "../interfaces/IDependent";

export class Dependent implements IDependentBase {
    dependent_id?: number;
    user_id?: number;
    holder_id: number;
    relationship_degree: string | null;

    constructor(data: IDependentBase) {
        this.dependent_id = data.dependent_id;
        this.user_id = data.user_id;
        this.holder_id = data.holder_id;
        this.relationship_degree = data.relationship_degree;
    }
}