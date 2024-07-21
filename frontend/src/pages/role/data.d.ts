export interface PaginationConfig {
  count: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableQueryParam {
  role?: string;
  current?: number;
  pageSize?: number;
}

export interface TableListItem {
  id: number;
  namespace: string;
  role: string;
  name: string;
  describe: string;
  operator: string;
  create_time: number;
  update_time: number;
}

