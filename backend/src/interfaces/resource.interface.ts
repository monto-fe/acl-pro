// 命名空间
export interface Resource {
    id: number; // Note that the `null assertion` `!` is required in strict mode.
    namespace: string;
    category: string;
    resource: string;
    properties: string;
    name: string;
    describe: string;
    operator: string;
    create_time: number;
    update_time: number;
}

export interface ResourceReq {
    id?: number;
    namespace: string;
    category: string;
    resource: string;
    properties: string;
    name: string;
    describe: string;
    operator: string;
}

export interface ResourceParams {
    namespace: string;
    category: string;
    resource: string;
    properties: string;
    name: string;
    describe: string;
    operator: string;
    create_time: number;
    update_time: number;
}