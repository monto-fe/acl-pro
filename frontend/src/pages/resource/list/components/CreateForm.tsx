import React from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form } from 'antd';

import { TableListItem } from '../../data.d';
import FormModal from '@/pages/component/form/FormModal';

interface ICreateFormProps {
  visible: boolean;
  setVisible: Function;
  initialValues?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: TableListItem, form: FormInstance) => void;
  onCancel?: () => void;
}

function CreateForm(props: ICreateFormProps) {
  const { visible, setVisible, initialValues, onSubmit, onSubmitLoading, onCancel } = props;

  const [form] = Form.useForm();

  const addFormItems = [
    {
      label: "资源名",
      name: "name",
      required: true,
      type: "Input"
    },
    {
      label: "资源",
      name: "resource",
      required: true,
      type: "Input"
    },
    {
      label: "资源属性",
      name: "properties",
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
      title="新增资源"
      ItemOptions={addFormItems}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  </>
};

export default CreateForm;
