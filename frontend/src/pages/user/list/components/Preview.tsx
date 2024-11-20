import { Button, Descriptions, Modal } from 'antd';
import { TableListItem } from '../data.d';
import { TableListItem as RoleTableListItem } from '@/pages/role/data.d';

interface PreviewProps {
  visible: boolean;
  setVisible: Function;
  data: Partial<TableListItem>;
  roleList: RoleTableListItem[];
}

function Preview(props: PreviewProps) {
  const { visible, setVisible, data, roleList } = props;

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <Modal
      open={visible}
      title="查看用户"
      width={800}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          关闭
        </Button>,
      ]}
    >
      <Descriptions className='mt-32' title="" layout="vertical" bordered size='small'>
        <Descriptions.Item label="英文名">{data?.user || '-'}</Descriptions.Item>
        <Descriptions.Item label="中文名">{data?.name || '-'}</Descriptions.Item>
        <Descriptions.Item label="职位">{data?.job || '-'}</Descriptions.Item>
        <Descriptions.Item label="邮箱">{data?.email || '-'}</Descriptions.Item>
        <Descriptions.Item label="手机号">{data?.phone_number || '-'}</Descriptions.Item>
        <Descriptions.Item label="角色">{Array.isArray(data?.role) ? (
          <span>
            {data?.role?.length ? (
              <div>
                {data?.role.map((item: any) => (
                  <div key={item.role}>{`${item.name} (${item.role})`}</div>
                ))}
              </div>
            ) : '-'}
          </span>
        ) : (
          ''
        )}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Preview;