'use client'
import { Button, Popconfirm, Popover, Space, message } from 'antd';
import React, { useEffect, useState } from 'react'

import CommonTable from '@/components/Table';
import FormModal from '@/components/Form/FormModal';

import { getRoleList, addRole, updateRole, deleteRole } from '@/utils/request/role';
import { renderDateFromTimestamp, timeFormatType } from '@/utils/timeFormat';
import Permission from '@/components/Permission';

const columns = (handleDelete: Function, handleUpdate: Function) => [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
    search: true,
  },
  {
    title: '角色名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'describe',
    key: 'describe',
  },
  {
    title: '创建人',
    dataIndex: 'operator',
    key: 'operator',
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
          onConfirm={() => handleDelete(record.role)}
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
    label: "角色",
    name: "role",
    required: true,
    type: "Input"
  },
  {
    label: "角色名称",
    name: "name",
    required: true,
    type: "Input"
  },
  {
    label: "描述",
    name: "describe",
    type: "Input"
  },
];

export default function List() {
  const [roleList, setRoleList] = useState([]);
  const [roleLoading, setRoleLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editInfo, setEditInfo] = useState<any>({});
  const [filter, setFilter] = useState<any>({});
  const [messageApi, contextHolder] = message.useMessage();

  const getList = (value?: any) => {
    setRoleLoading(true);
    setFilter(value || {});
    getRoleList(value)
      .then((res: any) => {
        setRoleList(res.Data || []);
        setRoleLoading(false)
      })
  };

  const handleAdd = () => {
    setAddOpen(true);
    setEditInfo({});
  }

  const onAdd = (values: any) => {
    setRoleLoading(true)
    const request = editInfo.id ? updateRole : addRole;
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

  const handleDelete = (role: string) => {
    deleteRole({ role }).then(() => {
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
      新增角色
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
          loading={roleLoading}
          handleSearch={handleSearch}
          leftActions={actions}
          data={roleList}
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
