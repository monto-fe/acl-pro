import { useEffect, useState, forwardRef, useImperativeHandle, Ref } from 'react'
import { Card, Dropdown, Flex, Input, Space, Table, Tooltip } from 'antd'
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { ColumnHeightOutlined, ReloadOutlined } from '@ant-design/icons';
import { TableProps } from 'antd/lib/table/InternalTable';
import { SorterResult } from 'antd/lib/table/interface';

import Filters from './Filter';
import { ITable, PaginationConfig } from './data.d';
import { ResponseData } from '@/utils/request';
import { AnyObject } from 'antd/lib/_util/type';

export const defaultCurrent = 1;
export const defaultPageSize = 10;

function CommonTable<T extends AnyObject>(props: ITable<T>, ref: Ref<unknown> | undefined) {
  const {
    queryList,
    columns,
    title,
    rowKey,
    useTools = true,
    fuzzySearchKey,
    fuzzySearchPlaceholder,
    filterFormItems,
    scroll
  } = props;
  const [list, setList] = useState<T[]>([]);
  const [size, setSize] = useState<SizeType>('middle');
  const [filter, setFilter] = useState<any>();
  const [externalFilter, setExternalFilter] = useState<any>();
  const [pagination, setPagination] = useState<PaginationConfig>({
    total: 0,
    current: defaultCurrent,
    pageSize: defaultPageSize,
    showSizeChanger: true,
    showQuickJumper: true,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [fuzzySearch, setFuzzySearch] = useState<string>('');

  const reload = () => {
    getList(pagination.current, pagination.pageSize, filter, externalFilter);
  }

  const rightTools = (
    <Space size="middle">
      <Tooltip title="刷新">
        <ReloadOutlined onClick={reload} />
      </Tooltip>
      <Dropdown menu={{
        selectedKeys: size ? [size] : undefined,
        items: [
          {
            label: '宽松',
            key: 'large',
          },
          {
            label: '中等',
            key: 'middle',
          },
          {
            label: '紧凑',
            key: 'small',
          },
        ],
        onClick: value => setSize(value.key as SizeType)
      }} trigger={['click']}>
        <Tooltip title="行高">
          <ColumnHeightOutlined />
        </Tooltip>
      </Dropdown>
    </Space>
  );

  const getList = (current: number, pageSize: number, filter?: any, externalFilter?: any): void => {
    setLoading(true);
    const params = {
      current,
      pageSize: pageSize || defaultPageSize,
      ...filter,
      ...externalFilter
    }

    if (fuzzySearch && fuzzySearchKey) {
      params[fuzzySearchKey] = fuzzySearch;
    }

    queryList(params).then((response: ResponseData<T[]>) => {
      if (response) {
        setList(Array.isArray(response.data) ? response.data : []);
        setPagination({
          ...pagination,
          current,
          pageSize,
          total: response.total || 0,
        });
        setFilter(filter);
      }

      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }

  const handleTableChange: TableProps['onChange'] = (pagination, filters, sorter) => {
    const params: any = {
      order: (sorter as SorterResult<any>).order,
      field: (sorter as SorterResult<any>).field,
    }

    if (filters) {
      Object.getOwnPropertyNames(filters).forEach(key => {
        if (Array.isArray(filters[key]) && (filters[key] as Array<string>).length) {
          params[key] = (filters[key] as Array<string>)[0] as string;
        }
      });
    }
    getList(pagination.current || defaultCurrent, pagination.pageSize || defaultPageSize, params, externalFilter);
  };

  const handleSearch = (values: any) => {
    setExternalFilter(values);
    getList(pagination.current, pagination.pageSize, filter, values);
  }

  const handleFuzzySearch = () => {
    getList(pagination.current, pagination.pageSize, filter, externalFilter);
  }

  useEffect(() => {
    getList(pagination.current, pagination.pageSize);
  }, []);

  useImperativeHandle(ref, () => ({
    reload,
  }));

  return (
    <>
      {filterFormItems ? (
        <Card
          bordered={false}
          className='mb-16'
        >
          <Filters items={filterFormItems} size={size} handleSearch={handleSearch} />
        </Card>
      ) : null}
      <Card
        bordered={false}
        title={title}
        extra={
          <Flex align='center'>
            {fuzzySearchKey ? <Input.Search placeholder={fuzzySearchPlaceholder || '模糊查询'} style={{ width: '270px', margin: '0px 16px' }} onChange={e => setFuzzySearch(e.target?.value)} onSearch={handleFuzzySearch} /> : null}
            {useTools ? rightTools : null}
          </Flex>
        }
      >
        <Table
          rowKey={rowKey || 'id'}
          columns={columns}
          dataSource={list}
          loading={loading}
          scroll={scroll}
          size={size}
          pagination={{
            ...pagination,
          }}
          onChange={handleTableChange}
        />
      </Card>
    </>
  )
}

export default forwardRef(CommonTable);