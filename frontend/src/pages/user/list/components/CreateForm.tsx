import { FormInstance } from 'antd/lib/form';
import { Form } from 'antd';

import { TableListItem, TableQueryParam } from '../data.d';
import { TableListItem as RoleTableListItem } from '@/pages/role/data.d';
import FormModal from '@/pages/component/Form/FormModal';

interface ICreateFormProps {
  visible: boolean;
  setVisible: Function;
  initialValues?: Partial<TableQueryParam>;
  roleList: RoleTableListItem[];
  onSubmitLoading: boolean;
  onSubmit: (values: TableListItem, form: FormInstance) => void;
  onCancel?: () => void;
}

function CreateForm(props: ICreateFormProps) {
  const { visible, setVisible, roleList, initialValues, onSubmit, onSubmitLoading, onCancel } = props;

  const [form] = Form.useForm();

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
      type: "SelectMultiple",
      options: (roleList || []).map((role: RoleTableListItem) => {
        return {
          label: `${role.name} (${role.role})`,
          value: role.id
        }
      })
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
      title={initialValues?.id ? '编辑用户' : '新增用户'}
      ItemOptions={addFormItems}
      onFinish={onFinish}
      onCancel={onCancel}
    />
  </>
};

export default CreateForm;