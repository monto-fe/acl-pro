'use client'
import { Button, Popover, TableColumnsType } from 'antd';
import React, { useEffect, useState } from 'react'

import CommonTable from '@/components/Table';
import FormModal from '@/components/Form/FormModal';

import { getRoleList, addRole } from '@/utils/request/role';

const columns: TableColumnsType = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '角色',
    dataIndex: 'role',
    key: 'role',
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
  },
  {
    title: '最近更新时间',
    dataIndex: 'update_time',
    key: 'update_time',
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    render: (text, record) => (
      <div>
        <Button size="small" type="link" onClick={() => { }}>
          角色管理
        </Button>
      </div>
    ),
  },
];

export default function List() {
  const [roleList, setRoleList] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

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
  ]

  const getList = () => {
    setRolesLoading(true)
    getRoleList()
      .then((res: any) => {
        setRoleList(res.Data || []);
        setRolesLoading(false)
      })
  };

  const handleAdd = () => {
    setAddOpen(true);
  }

  const onAdd = (values: any) => {
    setRolesLoading(true)
    addRole({ ...values })
      .then(() => {
        getList();
        setAddOpen(false);
      })
  }

  const actions = [
    <Button
      type="primary"
      onClick={handleAdd}
    >
      新增角色
    </Button>,
  ];

  useEffect(() => {
    getList();
  }, []);

  return <>
    <CommonTable rowKey="id" columns={columns} loading={rolesLoading} leftActions={actions} data={roleList} />
    {addOpen ? (
      <FormModal
        visible={addOpen}
        setVisible={setAddOpen}
        title="添加角色"
        ItemOptions={addFormItems}
        onFinish={onAdd}
      />
    ) : null}
  </>
}
