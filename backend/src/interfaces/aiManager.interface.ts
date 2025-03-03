export interface AIManager {
    id: number;
    name: string;
    model: string;
    api: string;
    api_key: string;
    status: 1 | -1; // 1: enable, -1: disabled
    expired: number;
    create_time: number;
    update_time: number;
    created_by?: string | null;  // `created_by` 是可选字段
    updated_by?: string | null;  // `updated_by` 是可选字段
}  

export interface AIManagerCreate {
    name: string;
    model: string;
    api: string;
    api_key: string;
    status: 1 | -1; // 1: enable, -1: disabled
    expired?: number;
    created_by?: string | null;  // `created_by` 是可选字段
    create_time?: number;
    update_time?: number;
}