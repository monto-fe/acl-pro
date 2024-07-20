import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message } from 'antd';

import { TableListItem } from '../data.d';
import FormModal from '@/pages/component/form/FormModal';

interface CreateFormProps {
  open: boolean;
  setOpen: Function;
  initialValues?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: Omit<TableListItem, 'id'>, form: FormInstance) => void;
  onCancel: () => void;
}

const addFormItems = [
  {
    label: "英文名",
    name: "user",
    required: true,
    type: "Input"
  },
  {
    label: "中文名",
    name: "name",
    required: true,
    type: "Input"
  },
  {
    label: "密码",
    name: "password",
    option: {
      placeholder: 'default: 12345678'
    },
    type: "Input"
  },
  {
    label: "职位",
    name: "job",
    type: "Input"
  },
  {
    label: "邮箱",
    name: "email",
    type: "Input"
  },
  {
    label: "手机号",
    name: "phone_number",
    type: "Input"
  },
  {
    label: "角色",
    name: "role_ids",
    type: "Select",
    options: []
  },
];

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { open, setOpen, initialValues, onSubmit, onSubmitLoading, onCancel } = props;

  const [form] = Form.useForm();

  const onFinish = async () => {
    try {
      const fieldsValue = await form.validateFields();
      onSubmit({ ...fieldsValue }, form);
    } catch (error) {
      message.warning('验证错误');
    }
  };

  return (
    <FormModal
      visible={open}
      setVisible={setOpen}
      confirmLoading={onSubmitLoading}
      initialValues={initialValues}
      title="新增用户"
      ItemOptions={addFormItems}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  );
};

export default CreateForm;
