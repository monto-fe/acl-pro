import { useEffect, useRef, useState } from 'react';
import {
  Button,
  FormInstance,
  message,
  Popconfirm,
  PopconfirmProps,
  Popover,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { ResponseData } from '@/utils/request';
import { createData, queryList, removeData, updateData as updateDataService } from './service';
import { queryList as queryRoleList } from '@/pages/role/service';
import { TableListItem as RoleTableListItem } from '@/pages/role/data.d';
import { TableListItem, TableQueryParam } from './data.d';

import CreateForm from './components/CreateForm';
import { renderDateFromTimestamp, timeFormatType } from '@/utils/timeformat';
import CommonTable from '@/pages/component/table';
import { ITable } from '@/pages/component/table/data';

function App() {
  const tableRef = useRef<ITable<TableListItem>>();
  const [roleList, setRoleList] = useState<RoleTableListItem[]>([]);

  const getRoleList = () => {
    queryRoleList({
      current: 1,
      pageSize: 99999,
    }).then((response: ResponseData<RoleTableListItem[]>) => {
      if (response) {
        setRoleList(response.data || []);
      }
    });
  }

  const reload = () => {
    tableRef.current && tableRef.current.reload && tableRef.current.reload()
  }

  useEffect(() => {
    getRoleList();
  }, []);

  // 删除
  const [deleteOpen, setDeleteOpen] = useState<number | undefined>();
  const handleDelete = (id: number) => setDeleteOpen(id);
  const deleteConfirm = (id: number, user: string) => {
    removeData(id, user).then(() => {
      message.success('删除成功！');
      reload();
      setDeleteOpen(void 0);
    })
  };

  const deleteCancel: PopconfirmProps['onCancel'] = (e) => {
    setDeleteOpen(void 0);
  };

  // 新增&编辑
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<TableQueryParam>>({});
  const handleCreate = () => {
    setUpdateData({});
    setCreateFormVisible(true);
  }

  const createSubmit = async (values: TableListItem, form: FormInstance) => {
    setCreateSubmitLoading(true);
    const request = updateData.id ? updateDataService : createData;
    request({ ...values, id: updateData.id as number }).then(() => {
      form.resetFields();
      setCreateFormVisible(false);
      message.success(values.id ? '修改成功' : '新增成功！');
      reload();

      setCreateSubmitLoading(false);
    }).catch(() => {
      setCreateSubmitLoading(false);
    });
  };

  const handleUpdate = (record: TableQueryParam) => {
    setUpdateData({
      ...record,
      password: '●●●●●●●●',
      role_ids: (record.role || []).map(role => role.id)
    });
    setCreateFormVisible(true);
  };

  const columns: ColumnsType<TableListItem> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '英文名',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
      key: 'roleName',
      width: 120,
      render: (text, record: TableListItem) => (
        <div>
          {Array.isArray(record.role) ? (
            <span>
              {record.role.length > 1 ? (
                <Popover
                  placement='right'
                  content={
                    <div>
                      {record.role.map((item: any) => (
                        <div key={item.role}>{`${item.name} (${item.role})`}</div>
                      ))}
                    </div>
                  }
                  trigger='hover'
                >
                  {record.role[0].name + '...'}
                </Popover>
              ) : (
                record.role[0].name
              )}
            </span>
          ) : (
            ''
          )}
        </div>
      ),
      filters: roleList.map((item) => ({
        text: `${item.name} (${item.role})`,
        value: item.name,
      })),
      filterMultiple: false,
      filterSearch: true,
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
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
      key: 'phone_number',
      width: 150,
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      width: 200,
      sorter: true,
      render: (text: number) => renderDateFromTimestamp(text, timeFormatType.time)
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      render: (text, record: TableListItem) => (
        <Space size='small'>
          <Button className='btn-group-cell' size='small' type='link' onClick={() => handleUpdate(record)}>
            编辑
          </Button>
          <Popconfirm
            open={deleteOpen === record.id}
            title='Delete the task'
            description='Are you sure to delete this task?'
            onConfirm={() => deleteConfirm(record.id, record.user)}
            onCancel={deleteCancel}
            okText='Yes'
            cancelText='No'
          >
            <Button danger className='btn-group-cell' onClick={() => handleDelete(record.id)} size='small' type='link'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const formItems = [
    {
      label: '英文名	',
      name: 'user',
      type: 'Input',
      span: 8
    },
    {
      label: '姓名',
      name: 'userName',
      type: 'Input',
      span: 8
    },
  ];

  return (
    <div className='layout-main-conent'>
      <CommonTable
        ref={tableRef}
        columns={columns}
        queryList={queryList}
        title={
          <Button type='primary' onClick={handleCreate}>
            新增用户
          </Button>
        }
        filterFormItems={formItems}
        useTools
        scroll={{ x: 1200 }}
      />
      <CreateForm
        initialValues={updateData}
        visible={createFormVisible}
        setVisible={setCreateFormVisible}
        roleList={roleList}
        onSubmit={createSubmit}
        onSubmitLoading={createSubmitLoading}
      />
    </div>
  );
}

export default App;
