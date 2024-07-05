'use client'
import React, { Fragment } from 'react';
import { Flex, Table } from 'antd';
import type { TableProps } from 'antd';

interface ITableDataType {
  rowKey: string;
  data: any[];
  columns: any[];
  loading: boolean;
  leftActions?: React.ReactElement[];
  onChange?: TableProps<any>['onChange']
}

export default function CommonTable(props: ITableDataType) {
  const { rowKey, data, columns, loading, leftActions, onChange } = props;
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
        rowKey={rowKey || 'Id'}
        loading={loading}
        columns={columns}
        dataSource={data}
        onChange={onChange}
        showSorterTooltip={false}
      />
    </>
  )
};
