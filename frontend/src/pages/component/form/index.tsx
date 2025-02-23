import { useContext, useEffect, useState } from 'react';
import { Button, Col, Form, Row, Space, theme } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import FormItemComponent from './Item';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { BasicContext } from '@/store/context';
import { useI18n } from '@/store/i18n';

interface IForm {
  items: any[];
  size?: SizeType;
  handleSearch?: Function;
}

function CommonForm(props: IForm) {
  const { items, size, handleSearch } = props;

  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);

  const [expand, setExpand] = useState(false);
  const [colCount, setColCount] = useState<number>(3);

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    // background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
  };

  const onFinish = (values: unknown) => {
    console.log('Receivd values of form: ', values);
    handleSearch && handleSearch(values);
  };

  const onClear = () => {
    handleSearch && handleSearch({});
  };

  useEffect(() => {
    if (items) {
      let span = 0;
      let count = 0;
      items
        .filter((item) => !item.hidden)
        .forEach((item) => {
          if (span + (item.span || 6) <= 24) {
            span += item.span || 6;
            count += 1;
          }
        });

      setColCount(count);
    }
  }, [items]);

  return (
    <Form size={size} form={form} name='advanced_search' style={formStyle} onFinish={onFinish}>
      <Row gutter={24}>
        {items
          .filter((item, index) => (expand ? true : index + 1 <= colCount))
          .map((item, index) =>
            item.hidden ? null : (
              <Col span={item.span ? item.span : 6} key={index}>
                <Form.Item
                  style={{ marginBottom: size === 'small' ? '10px' : '24px' }}
                  name={item.key || item.name}
                  label={item.label}
                  required={item.required}
                >
                  {FormItemComponent({ field: item })}
                </Form.Item>
              </Col>
            ),
          )}
      </Row>
      <section style={{ textAlign: 'right' }}>
        <Space size='small'>
          <Button type='primary' htmlType='submit' className='capitalize'>
            {t('app.form.search')}
          </Button>
          <Button
            className='capitalize'
            onClick={() => {
              form.resetFields();
              onClear();
            }}
          >
            {t('app.form.reset')}
          </Button>
          <a
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <DownOutlined rotate={expand ? 180 : 0} /> {t('app.form.expand')}
          </a>
        </Space>
      </section>
    </Form>
  );
}

export default CommonForm;
