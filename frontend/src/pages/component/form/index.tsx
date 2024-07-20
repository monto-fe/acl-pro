'use client';
import { useEffect, useState } from 'react';
import { Button, Col, Form, Row, Space, theme } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import FormItemComponent from './Item';

interface IForm {
  items: any[],
}

export default function CommonForm(props: IForm) {
  const { items } = props;

  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [expand, setExpand] = useState(false);
  const [colCount, setColCount] = useState<number>(3);

  const formStyle: React.CSSProperties = {
    maxWidth: 'none',
    // background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    paddingBottom: 24,
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  useEffect(() => {
    if (items) {
      let span = 0
      let count = 0
      items.filter(item => !item.hidden).forEach(item => {
        if (span + (item.span || 6) <= 24) {
          span += (item.span || 6)
          count += 1
        }
      })

      setColCount(count);
    }
  }, [items]);

  return (
    <Form form={form} name="advanced_search" style={formStyle} onFinish={onFinish}>
      <Row gutter={24}>
        {
          items.filter((item, index) => expand ? true : (index + 1) <= colCount).map((item, index) => (
            item.hidden ? null :
              <Col span={item.span ? item.span : 6} key={index}>
                <Form.Item
                  name={item.key || item.name}
                  label={item.label}
                  required={item.required}
                >
                  <FormItemComponent field={item} />
                </Form.Item>
              </Col>))
        }
      </Row>
      <section style={{ textAlign: 'right' }}>
        <Space size="small">
          <Button type="primary" htmlType="submit">
            搜索
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
            }}
          >
            重置
          </Button>
          <a
            onClick={() => {
              setExpand(!expand);
            }}
          >
            <DownOutlined rotate={expand ? 180 : 0} /> 展开
          </a>
        </Space>
      </section>
    </Form>
  );
};