'use client'
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { setCookie } from "nookies";
import { Button, Form, Input, Segmented, type FormProps } from 'antd';

import { login } from '@/utils/request/user';

import styles from './index.module.less';

interface FieldType {
  email?: string;
  pwd?: string;
  code?: string;
  remember?: string;
};

const mode = ['登录'];

export default function Home() {
  const t = useTranslations();
  const [curMode, setCurMode] = useState(mode[0]);
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish: FormProps<FieldType>["onFinish"] = (values: any) => {
    if (curMode === mode[0]) {
      const { user, password } = values;
      login({ user, password })
        .then((res: any) => {
          if (res && res.data) {
            setCookie(null, 'MONTO_ACL_JWT_TOKEN', res.data.jwt_token, { secure: true, sameSite: 'strict' });
            router.push('/');
          }
        })
      return
    }
  };

  return (
    <main className={styles.loginWrap}>
      <div className={styles.leftBanner}>
        <span className={styles.logo}>Monto-ACL</span>
        <h2>下一代MPA中后台管理解决方案</h2>
        <div style={{ textAlign: 'center' }}>开箱即用 • Next前后端同构 • 数智化 • 聚合行业最佳实践</div>
        <div className={styles.banner}><img src="/logo_bg.svg" alt="" /></div>
      </div>
      <div className={styles.content}>
        <div className={styles.innerContent}>
          <h1>欢迎登录 Monto-ACL 中后台管理系统</h1>
          <Segmented<string>
            options={mode}
            size="large"
            onChange={(value) => {
              setCurMode(value);
              form.resetFields();
            }}
          />
          <Form
            name="basic"
            className={styles.form}
            wrapperCol={{ span: 24 }}
            style={{ maxWidth: 420 }}
            form={form}
            onFinish={onFinish}
            initialValues={{
              user: '',
              password: ''
            }}
            autoComplete="off"
          >
            {
              curMode === mode[0] ?
                <>
                  <Form.Item<FieldType>
                    name="user"
                    rules={[
                      {
                        required: true,
                        message: '请输入用户名',
                      },
                    ]}
                  >
                    <Input placeholder='用户名' size='large' variant="filled" />
                  </Form.Item>

                  <Form.Item<FieldType>
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                  >
                    <Input.Password size='large' placeholder='密码' variant="filled" />
                  </Form.Item>

                  <Form.Item wrapperCol={{ span: 24 }}>
                    <Button type="primary" htmlType="submit" block size='large'>
                      登录
                    </Button>
                  </Form.Item>
                </> : null
            }
          </Form>
        </div>
      </div>
    </main>
  );
}
