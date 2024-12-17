import { useRef, useState } from 'react';
import {
  Button,
  FormInstance,
  message,
  Popconfirm,
  PopconfirmProps,
  Space,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';

import { createData, queryList, removeData, updateData as updateDataService } from '../service';
import { TableListItem } from '../data.d';

import CreateForm from './components/CreateForm';
import { renderDateFromTimestamp, timeFormatType } from '@/utils/timeformat';
import CommonTable from '@/pages/component/Table';
import { ITable } from '@/pages/component/Table/data';

function App() {
  const tableRef = useRef<ITable<TableListItem>>();

  const reload = () => {
    tableRef.current && tableRef.current.reload && tableRef.current.reload()
  }

  // 删除
  const [deleteOpen, setDeleteOpen] = useState<number | undefined>();
  const handleDelete = (id: number) => setDeleteOpen(id);
  const deleteConfirm = (id: number) => {
    removeData(id).then(() => {
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
      reload();

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
      width: 60
    },
    {
      title: '资源名',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '资源',
      dataIndex: 'resource',
      key: 'resource',
    },
    {
      title: '类别',
      dataIndex: 'category',
      key: 'category',
      onFilter: (value, record: any) => record.role_info.findIndex((item: any) => item.role === value) > -1,
      width: 100
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
      width: 200,
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
            onConfirm={async () => deleteConfirm(record.id)}
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
      label: '资源名	',
      name: 'name',
      type: 'Input',
      span: 8
    },
    {
      label: '资源',
      name: 'resource',
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
            新增资源
          </Button>
        }
        useTools
        filterFormItems={formItems}
        scroll={{ x: 1200 }}
      />

      <CreateForm
        initialValues={updateData}
        visible={createFormVisible}
        setVisible={setCreateFormVisible}
        onSubmit={createSubmit}
        onSubmitLoading={createSubmitLoading}
      />
    </div>
  );
}

export default App;
