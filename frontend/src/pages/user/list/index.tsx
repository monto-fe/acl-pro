import { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Divider,
  FormInstance,
  Input,
  message,
  Modal,
  Popconfirm,
  PopconfirmProps,
  Popover,
  Radio,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { ResponseData } from '@/utils/request';
import { createData, queryList, removeData, updateData as updateDataService } from './service';
import { Filter, PaginationConfig, TableListItem } from './data.d';

import CreateForm from './components/CreateForm';

function App() {
  // 获取数据
  const [loading, setLoading] = useState<boolean>(false);
  const [list, setList] = useState<TableListItem[]>([]);
  const [filter, setFilter] = useState<Filter>();
  const [pagination, setPagination] = useState<PaginationConfig>({
    count: 0,
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
  });

  const getList = async (current: number, pageSize: number, filter?: Filter): Promise<void> => {
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
    getList(pagination.current, pagination.pageSize, { user: value });
  };

  // 删除
  const [deleteOpen, setDeleteOpen] = useState<number | undefined>();
  const handleDelete = (id: number) => setDeleteOpen(id);
  const deleteConfirm = async (id: number, user: string) => {
    setLoading(true);
    await removeData(id, user);
    message.success('删除成功！');
    getList(1, pagination.pageSize, filter);
    setLoading(false);
    setDeleteOpen(void 0);
  };

  const deleteCancel: PopconfirmProps['onCancel'] = (e) => {
    message.error('Click on No');
    setDeleteOpen(void 0);
  };

  // 编辑弹框 data - 详情
  const [updateSubmitLoading, setUpdateSubmitLoading] = useState<boolean>(false);
  const [updateFormVisible, setUpdateFormVisible] = useState<boolean>(false);
  const [updateData, setUpdateData] = useState<Partial<TableListItem>>({});
  const [detailUpdateLoading, setDetailUpdateLoading] = useState<number[]>([]);
  const detailUpdateData = async (id: number) => {
    console.log(id);
    // setDetailUpdateLoading([id]);

    // const response: ResponseData<TableListItem> = await detailData(id);
    // const { data } = response;
    // setUpdateData({
    //   ...data,
    // });
    // setUpdateFormVisible(true);

    // setDetailUpdateLoading([]);
  };

  const updataFormCancel = async () => {
    setUpdateData({});
    setUpdateFormVisible(false);
  };

  const updateSubmit = async (values: TableListItem) => {
    setUpdateSubmitLoading(true);

    const { id, ...params } = values;
    await updateDataService(id, { ...params });
    updataFormCancel();
    message.success('编辑成功！');
    getList(pagination.current, pagination.pageSize, filter);

    setUpdateSubmitLoading(false);
  };

  // 新增
  const [createSubmitLoading, setCreateSubmitLoading] = useState<boolean>(false);
  const [createFormVisible, setCreateFormVisible] = useState<boolean>(false);
  const createSubmit = async (values: Omit<TableListItem, 'id'>, form: FormInstance) => {
    setCreateSubmitLoading(true);

    await createData(values);
    form.resetFields();
    setCreateFormVisible(false);
    message.success('新增成功！');
    getList(pagination.current, pagination.pageSize, filter);

    setCreateSubmitLoading(false);
  };

  const columns: ColumnsType<TableListItem> = [
    {
      title: 'userId',
      dataIndex: 'id',
      key: 'user_idid',
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
      dataIndex: 'role_info',
      key: 'role_info',
      render: (text) => (
        <div>
          {Array.isArray(text) ? (
            <span>
              {text.length > 1 ? (
                <Popover
                  placement='right'
                  content={
                    <div>
                      {text.map((item: any) => (
                        <div key={item.role}>{item.role_name}</div>
                      ))}
                    </div>
                  }
                  trigger='hover'
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
      // filters: roles.map((item) => ({
      //   text: item.name,
      //   value: item.role,
      // })),
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
      render: (text, record: TableListItem) => (
        <Space size='small'>
          <Button className='btn-group-cell' size='small' type='link' onClick={() => {}}>
            编辑
          </Button>
          <Popconfirm
            open={deleteOpen === record.id}
            title='Delete the task'
            description='Are you sure to delete this task?'
            onConfirm={async () => deleteConfirm(record.id, record.user)}
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
          <Button type='primary' onClick={() => setCreateFormVisible(true)}>
            新增用户
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
