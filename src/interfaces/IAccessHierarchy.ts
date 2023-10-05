export default interface IAccessHierarchy {
    hierarchy_id: number;
    level_name: string;
    parent_level_id: number | null;
    created_at?: Date;
}