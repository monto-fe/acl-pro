import React, { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message } from 'antd';

// import { queryList as queryRoleList } from '../../service';

import { TableListItem } from '../../data.d';
import FormModal from '@/pages/component/Form/FormModal';

interface ICreateFormProps {
  visible: boolean;
  setVisible: Function;
  initialValues?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: TableListItem, form: FormInstance) => void;
  onCancel?: () => void;
}

const CreateForm: React.FC<ICreateFormProps> = (props) => {
  const { visible, setVisible, initialValues, onSubmit, onSubmitLoading, onCancel } = props;

  const [form] = Form.useForm();

  const addFormItems = [
    {
      label: "角色名",
      name: "name",
      required: true,
      type: "Input"
    },
    {
      label: "角色",
      name: "role",
      required: true,
      type: "Input"
    },
    {
      label: "描述",
      name: "describe",
      type: "Input"
    },
  ];

  const onFinish = async (values: TableListItem) => {
    onSubmit({ ...values }, form);
  };

  return <>
    <FormModal
      visible={visible}
      setVisible={setVisible}
      confirmLoading={onSubmitLoading}
      initialValues={initialValues}
      title="新增角色"
      ItemOptions={addFormItems}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  </>
};

export default CreateForm;
