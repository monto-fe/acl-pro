import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  FormInstance,
  Input,
  message,
  Popconfirm,
  PopconfirmProps,
  Popover,
  Space,
  Table,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { ResponseData } from '@/utils/request';
import { createData, queryList, removeData, updateData as updateDataService } from '../service';
import { TableQueryParam, PaginationConfig, TableListItem } from '../data.d';

import CreateForm from './components/CreateForm';
import { renderDateFromTimestamp, timeFormatType } from '@/utils/timeformat';

function App() {
  // 获取数据
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<TableListItem[]>([]);
  const [filter, setFilter] = useState<TableQueryParam>();
  const [pagination, setPagination] = useState<PaginationConfig>({
    count: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const getList = async (current: number, pageSize: number, filter?: TableQueryParam): Promise<void> => {
    setLoading(true);

    const response: ResponseData<TableListItem[]> = await queryList({
      current,
      pageSize: pageSize || 10,
      ...filter
    });
    if (response) {
      setList(response.data || []);
      setPagination({
        ...pagination,
        current,
        count: response.count || 0,
      });
      setFilter(filter);
    }

    setLoading(false);
  };

  useEffect(() => {
    getList(pagination.current, pagination.pageSize);
  }, []);

  // 搜索
  const handleSearch = (value: string) => {
    getList(pagination.current, pagination.pageSize, { role: value });
  };

  // 删除
  const [deleteOpen, setDeleteOpen] = useState<number | undefined>();
  const handleDelete = (id: number) => setDeleteOpen(id);
  const deleteConfirm = async (id: number) => {
    setLoading(true);
    await removeData(id);
    message.success('删除成功！');
    getList(1, pagination.pageSize, filter);
    setLoading(false);
    setDeleteOpen(void 0);
  };

  const deleteCancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('Click on No');
    setDeleteOpen(void 0);
  };

  // 新增&编辑
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<TableListItem>>({});
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
      getList(pagination.current, pagination.pageSize, filter);
  
      setCreateSubmitLoading(false);
    }).catch(() => {
      setCreateSubmitLoading(false);
    });
  };

  const handleUpdate = async (record: TableListItem) => {
    setUpdateData({
      ...record,
    });
    setCreateFormVisible(true);
  };

  const columns: ColumnsType<TableListItem> = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      // filters: roles.map((item) => ({
      //   text: item.name,
      //   value: item.role,
      // })),
      onFilter: (value, record: any) => record.role_info.findIndex((item: any) => item.role === value) > -1,
    },
    {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe',
    },
    {
      title: '更新人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '更新时间',
      dataIndex: 'update_time',
      key: 'update_time',
      render: (text: number) => renderDateFromTimestamp(text, timeFormatType.time)
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record: TableListItem) => (
        <Space size='small'>
          <Button loading={loading} className='btn-group-cell' size='small' type='link' onClick={() => handleUpdate(record)}>
            编辑
          </Button>
          <Popconfirm
            open={deleteOpen === record.id}
            title='Delete the task'
            description='Are you sure to delete this task?'
            onConfirm={async () => deleteConfirm(record.id)}
            onCancel={deleteCancel}
            okText='Yes'
            cancelText='No'
          >
            <Button danger loading={loading} className='btn-group-cell' onClick={() => handleDelete(record.id)} size='small' type='link'>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='layout-main-conent'>
      <Card
        bordered={false}
        title={
          <Button type='primary' onClick={handleCreate}>
            新增角色
          </Button>
        }
        extra={
          <Input.Search placeholder='请输入' style={{ width: '270px', marginLeft: '16px' }} onSearch={handleSearch} />
        }
      >
        <Table
          rowKey='id'
          columns={columns}
          dataSource={list}
          loading={loading}
          pagination={{
            ...pagination,
            onChange: (page: number, pageSize: number) => {
              getList(page, pageSize, filter);
            },
          }}
        />
      </Card>

      <CreateForm
        initialValues={updateData}
        onCancel={() => setCreateFormVisible(false)}
        open={createFormVisible}
        setOpen={setCreateFormVisible}
        onSubmit={createSubmit}
        onSubmitLoading={createSubmitLoading}
      />
    </div>
  );
}

export default App;
