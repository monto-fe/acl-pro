export interface PaginationConfig {
  total: number;
  current: number;
  pageSize: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

export interface ITable<T> {
  queryList: Function;
  columns: ColumnsType<any>;
  title?: React.ReactElement | string;
  rowKey?: string;
  useTools?: boolean;
  fuzzySearchKey?: string;
  fuzzySearchPlaceholder?: string;
  filterFormItems?: ITableFilterItem[];
  scroll?: { x?: number, y?: number };
  reload?: Function;
}

export interface ITableFilter {
  items: ITableFilterItem[];
  size: SizeType;
  handleSearch?: Function;
}

export interface ITableFilterItem {
  label: string;
  name: string;
  type: string;
  option?: unknown;
  options?: unknown;
  span?: number;
  required?: boolean;
}