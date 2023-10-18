export default interface IBlogPost {
    post_id?: number;
    author_id: number;
    title: string;
    content: string;
    category?: string;
    tags?: string;
    views?: number;
    last_edit?: Date;
    last_editor_id?: number;
    created_at?: Date;
}