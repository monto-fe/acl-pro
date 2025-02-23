import React, { useContext } from 'react';
import { FormInstance } from 'antd/lib/form';
import { Form } from 'antd';

import { BasicContext } from '@/store/context';
import { useI18n } from '@/store/i18n';

import FormModal from '@/pages/component/Form/FormModal';
import { TableListItem } from '../../data.d';
import { resourceCategories } from '../../const';

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
  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);

  const addFormItems = [
    {
      label: t('page.resource.name'),
      name: 'name',
      required: true,
      type: 'Input',
    },
    {
      label: t('page.resource.key'),
      name: 'resource',
      required: true,
      type: 'Input',
    },
    {
      label: t('page.resource.category'),
      name: 'category',
      required: true,
      type: 'Select',
      options: resourceCategories.map((item: string) => ({
        label: item,
        value: item,
      })),
    },
    {
      label: t('page.resource.describe'),
      name: 'describe',
      type: 'Input',
    },
  ];

  const onFinish = async (values: TableListItem) => {
    onSubmit({ ...values }, form);
  };

  return (
    <>
      <FormModal
        visible={visible}
        setVisible={setVisible}
        confirmLoading={onSubmitLoading}
        initialValues={initialValues}
        title={t('page.resource.add')}
        ItemOptions={addFormItems}
        onFinish={onFinish}
        onCancel={onCancel}
      />
    </>
  );
}

export default CreateForm;
