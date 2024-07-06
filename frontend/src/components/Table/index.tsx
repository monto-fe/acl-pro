'use client'
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Button, Flex, Input, Space, Table } from 'antd';
import type { InputRef, TableColumnType, TableColumnsType, TableProps } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { FilterDropdownProps } from 'antd/es/table/interface';

interface ITableDataType {
  rowKey: string;
  data: any[];
  columns: any[];
  loading: boolean;
  handleSearch: Function;
  leftActions?: React.ReactElement[];
  scroll?: { x: number };
  onChange?: TableProps<any>['onChange']
}

export default function CommonTable(props: ITableDataType) {
  const { rowKey, data, columns, loading, leftActions, handleSearch, onChange, ...rest } = props;

  const [filteredColumns, setFilteredColumns] = useState<TableColumnsType>(columns);
  const searchInput = useRef<InputRef>(null);

  const onSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: any,
  ) => {
    confirm();
    handleSearch && handleSearch({ key: dataIndex, value: selectedKeys[0] });
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
  };

  const getColumnSearchProps = (dataIndex: any): TableColumnType<ITableDataType> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters, confirm, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => onSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => onSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
    ),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  useEffect(() => {
    setFilteredColumns(columns.map(column => {
      if (column.search) {
        return {
          ...column,
          ...getColumnSearchProps(column.key),
        }
      }

      return column;
    }))
  }, [columns]);

  return (
    <>
      {Array.isArray(leftActions) ? (
        <Flex className='mt-4 mb-16'>
          {leftActions.map((action, index) => {
            return <Fragment key={index}>{action}</Fragment>
          })}
        </Flex>
      ) : null}
      <Table
        rowKey={rowKey}
        loading={loading}
        columns={filteredColumns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={false}
        {...rest}
      />
    </>
  )
};
