import React, { useContext } from 'react';
import { Modal, Form } from 'antd';
import FormItemComponent from './Item';
import { BasicContext } from '@/store/context';
import { useI18n } from '@/store/i18n';

interface IFormModal {
  formInstance?: any;
  visible: boolean;
  setVisible: Function;
  width?: number;
  title: React.ReactElement | string | undefined;
  description?: React.ReactElement | string | undefined;
  footer?: React.ReactElement | string | undefined;
  confirmLoading?: boolean;
  ItemOptions: any[];
  initialValues?: any;
  onFieldsChange?: Function;
  formLayout?: {
    labelCol: { span: number };
    wrapperCol: { span: number };
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
function FormModal(props: IFormModal) {
  const {
    formInstance,
    visible,
    setVisible,
    width,
    title,
    description,
    footer,
    confirmLoading,
    ItemOptions,
    initialValues,
    onFieldsChange,
    formLayout,
    onFinish,
    onCancel,
    ...resProps
  } = props;

  const [form] = formInstance || Form.useForm();

  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);

  const onOk = () => {
    form.validateFields().then((values: any) => {
      const data = { ...values };
      onFinish && onFinish(data);
    });
  };

  const handleFieldChange = (field: FieldData[], fields: FieldData[]): void => {
    if (onFieldsChange) {
      onFieldsChange(form, field, fields);
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        onCancel && onCancel();
        setVisible(false);
        form.resetFields();
      }}
      destroyOnClose
      maskClosable={false}
      onOk={onOk}
      width={width}
      cancelText={t('app.global.close')}
      confirmLoading={confirmLoading}
    >
      {description && <Form.Item>{description}</Form.Item>}
      {visible ? (
        <Form
          form={form}
          {...layout}
          {...formLayout}
          {...resProps}
          initialValues={initialValues}
          onFieldsChange={handleFieldChange}
          clearOnDestroy
        >
          {ItemOptions.map((item, index) =>
            item.hidden ? null : (
              <Form.Item
                key={index}
                {...item}
                rules={
                  item.validators
                    ? [
                        { required: item.required, message: `${item.label} ${t('app.form.required')} ！` },
                        ...item.validators,
                      ]
                    : [{ required: item.required, message: `${item.label} ${t('app.form.required')} ！` }]
                }
              >
                {FormItemComponent({ field: item })}
              </Form.Item>
            ),
          )}
        </Form>
      ) : null}
      {footer}
    </Modal>
  );
}

export default FormModal;
