'use client'
import { Button, Popconfirm, Popover, Space, message } from 'antd';
import React, { useEffect, useState } from 'react'

import CommonTable from '@/components/Table';
import FormModal from '@/components/Form/FormModal';

import { getPermissionSourceList, addPermissionSource, updatePermissionSource, deletePermissionSource } from '@/utils/request/permissions';
import { renderDateFromTimestamp, timeFormatType } from '@/utils/timeFormat';
import Permission from '@/components/Permission';

const columns = (handleDelete: Function, handleUpdate: Function) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '权限资源',
    dataIndex: 'resource',
    key: 'resource',
  },
  {
    title: '资源类别',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '资源属性',
    dataIndex: 'properties',
    key: 'properties',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 180,
    render: (text: number) => renderDateFromTimestamp(text, timeFormatType.time)
  },
  {
    title: '最近更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
    width: 180,
    render: (text: number) => renderDateFromTimestamp(text, timeFormatType.time)
  },
  {
    title: '操作',
    dataIndex: 'action',
    fixed: 'right',
    key: 'action',
    render: (text: never, record: any) => (
      <Space size="small">
        <Button size="small" className="operation-btn-group" type="link" onClick={() => handleUpdate(record)}>
          修改
        </Button>
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          onConfirm={() => handleDelete(record.resource)}
          okText="Yes"
          cancelText="No"
        >
          <Button size="small" className="operation-btn-group" type="link" danger>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const addFormItems = [
  {
    label: "权限资源",
    name: "resource",
    required: true,
    type: "Input"
  },
  {
    label: "资源名称",
    name: "name",
    required: true,
    type: "Input"
  },
  {
    label: "描述",
    name: "describe",
    type: "Input"
  },
  {
    label: "分类",
    name: "category",
    type: "Input"
  },
];

export default function List() {
  const [sourceList, setSourceList] = useState([]);
  const [sourceLoading, setSourceLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editInfo, setEditInfo] = useState<any>({});
  const [filter, setFilter] = useState<any>({});
  const [messageApi, contextHolder] = message.useMessage();

  const getList = (value?: any) => {
    setSourceLoading(true);
    setFilter(value || {});
    getPermissionSourceList()
      .then((res: any) => {
        setSourceList(res.Data || []);
        setSourceLoading(false)
      })
  };

  const handleAdd = () => {
    setAddOpen(true);
    setEditInfo({});
  }

  const onAdd = (values: any) => {
    setSourceLoading(true)
    const request = editInfo.id ? updatePermissionSource : addPermissionSource;
    request({ ...values, id: editInfo.id })
      .then(() => {
        getList(filter);
        setAddOpen(false);
      })
  }

  const handleSearch = (value: any) => {
    if (value) {
      getList({ [value.key]: value.value })
    }
  }

  const handleDelete = (resource: string) => {
    deletePermissionSource({ resource }).then(() => {
      messageApi.success('删除成功!');
      getList(filter);
    }).catch(() => {})
  }

  const handleUpdate = (record: any) => {
    setAddOpen(true);
    setEditInfo(record);
  }

  const actions = [
    <Button
      key={0}
      type="primary"
      onClick={handleAdd}
    >
      新增权限资源
    </Button>,
  ];

  useEffect(() => {
    getList();
  }, []);

  return (
    <Permission aclKey='asdfg'>
      <>
        {contextHolder}
        <CommonTable
          rowKey="id"
          columns={columns(handleDelete, handleUpdate)}
          loading={sourceLoading}
          handleSearch={handleSearch}
          leftActions={actions}
          data={sourceList}
          scroll={{ x: 1000 }}
        />
        {addOpen ? (
          <FormModal
            visible={addOpen}
            setVisible={setAddOpen}
            initialValues={editInfo}
            title="添加角色"
            ItemOptions={addFormItems}
            onFinish={onAdd}
          />
        ) : null}
      </>
    </Permission>
  )
}
