import React, { useEffect, useState } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Modal, Form, Input, Button, message } from 'antd';

// import { queryList as queryRoleList } from '../../service';

import { TableListItem } from '../../data.d';
import FormModal from '@/pages/component/form/FormModal';

interface CreateFormProps {
  open: boolean;
  setOpen: Function;
  initialValues?: Partial<TableListItem>;
  onSubmitLoading: boolean;
  onSubmit: (values: TableListItem, form: FormInstance) => void;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { open, setOpen, initialValues, onSubmit, onSubmitLoading, onCancel } = props;

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

  useEffect(() => {
    if (open) {
      // queryRoleList().then(res => {
      //   setRoleList(res.data || []);
      // });
    }
  }, [open]);

  return <>
    {open ? (
      <FormModal
        visible={open}
        setVisible={setOpen}
        confirmLoading={onSubmitLoading}
        initialValues={initialValues}
        title="新增资源"
        ItemOptions={addFormItems}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    ) : null}
  </>
};

export default CreateForm;
