export default interface IOrthoHistory {
    ortho_history_id?: number;
    member_id: number;
    has_orthodontic_device: boolean;
    ortho_value: number;
    reference_month: number;
    reference_year: number;
    created_at?: Date;
}