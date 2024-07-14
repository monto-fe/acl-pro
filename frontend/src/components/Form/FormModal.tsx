'use client'
import React, { useEffect } from 'react';
import { Modal, Form } from 'antd';
import FormItemComponent from './items';

interface IFormModal {
  formInstance?: any;
  visible: boolean;
  setVisible: Function;
  width?: number;
  title: React.ReactElement | string | undefined;
  description?: React.ReactElement | string | undefined;
  footer?: React.ReactElement | string | undefined;
  loading?: boolean;
  confirmLoading?: boolean;
  ItemOptions: any[];
  initialValues?: any;
  onFieldsChange?: Function;
  formLayout?: {
    labelCol: { span: number },
    wrapperCol: { span: number },
  };
  onFinish?: Function;
  onCancel?: Function;
}

interface FieldData {
  name: string | number | (string | number)[];
  value?: any;
  touched?: boolean;
  validating?: boolean;
  errors?: string[];
}

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

/**
 *  表单弹窗 
 * @param ItemOptions 表单配置
 * ItemOptions = {
    label: "标题",
    name: "字段名",
    required: "必填-boolean",
    content: "表单",
    hidden: "隐藏-boolean",
    title: "作为文本标题展示-boolean"
 * }
 * @param initialValues 表单整体的默认值，不再使用单个表单默认值
 * */
export default function FormModal(props: IFormModal) {
  const {
    formInstance,
    visible,
    setVisible,
    width,
    title,
    description,
    footer,
    loading,
    confirmLoading,
    ItemOptions,
    initialValues,
    onFieldsChange,
    formLayout,
    onFinish,
    onCancel,
    ...resProps
  } = props;

  // eslint-disable-next-line
  const [form] = formInstance || Form.useForm();

  const onOk = () => {
    form.validateFields().then((values: any) => {
      const data = { ...values };
      onFinish && onFinish(data);
    });
  };

  const handleFieldChange = (field: FieldData[], fields: FieldData[]): void => {
    if (onFieldsChange) {
      onFieldsChange(form, field, fields);
      return;
    }
  };

  // 自动重置表单
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        onCancel && onCancel();
        setVisible(false);
      }}
      maskClosable={false}
      onOk={onOk}
      width={width}
      cancelText={'关闭'}
      confirmLoading={confirmLoading}
    >
      {description && <Form.Item>{description}</Form.Item>}
      <Form
        form={form}
        {...layout}
        {...formLayout}
        {...resProps}
        initialValues={initialValues}
        onFieldsChange={handleFieldChange}
      >
        {ItemOptions.map((item, index) =>
          item.hidden ? null : (
            <Form.Item
              key={index}
              {...item}
              rules={
                item.validators
                  ? [{ required: item.required, message: `${item.label}必填！` }, ...item.validators]
                  : [{ required: item.required, message: `${item.label}必填！` }]
              }
            >
              {FormItemComponent({ field: item })}
            </Form.Item>
          )
        )}
      </Form>
      {footer}
    </Modal>
  );
}
