import React, { useEffect, useState } from 'react';
import { Modal, Transfer } from 'antd';
import type { TransferProps } from 'antd';

import { queryList as querySourceList } from '@/pages/resource/service';
import { TableListItem } from '../../data';
import { assertRolePermission } from '../../service';

interface ISourceConfigFormProps {
  visible: boolean;
  setVisible: Function;
  title: string;
  width?: number;
  configData?: Partial<TableListItem>;
  onCancel?: () => void;
  callback?: () => void;
}

interface RecordType {
  id: string;
  key: string;
  name: string;
  describe: string;
  resource: string;
  chosen: boolean;
}

function SourceConfigForm(props: ISourceConfigFormProps) {
  const { title, visible, setVisible, onCancel, width, configData, callback } = props;

  const [loading, setLoading] = useState<boolean>(false);
  const [datasource, setDatasource] = useState<RecordType[]>([]);
  const [targetKeys, setTargetKeys] = useState<TransferProps['targetKeys']>([]);

  const filterOption = (inputValue: string, option: RecordType) =>
    (option.name + option.resource + option.describe).indexOf(inputValue) > -1;

  const handleChange: TransferProps['onChange'] = (newTargetKeys) => {
    setTargetKeys(newTargetKeys || []);
  };

  const onOk = () => {
    if (configData?.id && targetKeys) {
      setLoading(true);
      assertRolePermission(configData.id, targetKeys.map((key) => {
        return { resource_id: +(key as number) }
      })).then(() => {
        setLoading(false);
        setVisible(false);
        callback && callback();
      }).catch(() => {
        setLoading(false);
      })
    }
  }

  useEffect(() => {
    setTargetKeys((configData?.resource || []).map(res => +res.id));
  }, [configData]);

  useEffect(() => {
    setLoading(true);
    querySourceList().then(res => {
      setDatasource((res.data || []).map((data: RecordType) => { return { ...data, key: +data.id } }));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={() => {
        onCancel && onCancel();
        setVisible(false);
      }}
      loading={loading}
      destroyOnClose
      maskClosable={false}
      onOk={onOk}
      width={width}
      cancelText={'关闭'}
    >
      <Transfer
        dataSource={datasource}
        showSearch
        filterOption={filterOption}
        targetKeys={targetKeys}
        onChange={handleChange}
        listStyle={{ height: 600 }}
        render={(item) => `${item.name} (${item.resource})`}
      />
    </Modal>
  );
};

export default SourceConfigForm;