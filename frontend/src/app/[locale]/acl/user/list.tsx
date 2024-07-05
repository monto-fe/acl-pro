'use client'
import { Button, Popover, TableColumnsType } from 'antd';
import React, { useState } from 'react'

import CommonTable from '@/components/Table';
import { isValidArray } from '@/utils';

import Filters from './filters';

interface ITableUserType {
  title: string;
  dataIndex: string;
  key: string
}

const columns: (roles: any[]) => TableColumnsType<ITableUserType> = (roles) => [
  {
    title: 'userId',
    dataIndex: 'user_id',
    key: 'user_id',
  },
  {
    title: '英文名',
    dataIndex: 'user',
    key: 'user',
  },
  {
    title: '姓名',
    dataIndex: 'user_name',
    key: 'user_name',
  },
  {
    title: '角色',
    dataIndex: 'role_info',
    key: 'role_info',
    render: (text) => (
      <div>
        {isValidArray(text) ? (
          <span>
            {text.length > 1 ? (
              <Popover
                placement="right"
                title="多角色"
                content={
                  <div>
                    {text.map((item: any) => (
                      <div key={item.role}>{item.role_name}</div>
                    ))}
                  </div>
                }
                trigger="hover"
              >
                {text[0].role_name + '...'}
              </Popover>
            ) : (
              text[0].role_name
            )}
          </span>
        ) : (
          ''
        )}
      </div>
    ),
    filters: roles.map((item) => ({
      text: item.name,
      value: item.role,
    })),
    onFilter: (value, record: any) => record.role_info.findIndex((item: any) => item.role === value) > -1,
  },
  {
    title: '职位',
    dataIndex: 'job',
    key: 'job',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone_number',
    key: 'phone_number',
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
  const [roles, setRoles] = useState([]);
  const [rolesLoading, setRolesLoading] = useState(false);

  const [data, setData] = useState([
    {
      user_id: 34324,
      user: 'heng.du',
      user_name: '肚肚',
      role_info: [
        {
          "role_id": 150024,
          "role": "spt",
          "role_name": "技术支持"
        }
      ],
      job: '管理员',
      email: '234567@qq.com',
      phone_number: 1234543321
    }
  ]);

  return <>
    <Filters />
    <CommonTable rowKey="user_id" columns={columns(roles)} data={data} />
  </>
}
