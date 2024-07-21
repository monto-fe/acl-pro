export interface PaginationConfig {
  count: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface TableQueryParam {
  user?: string;
  current?: number;
  pageSize?: number;
}

export interface TableListItem {
  id: number;
  o_id: number;
  namespace: 'string';
  user: 'string';
  name: 'string';
  job: 'string';
  phone_number: number;
  email: 'string';
  create_time: number;
  update_time: number;
}

