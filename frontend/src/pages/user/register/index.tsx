import { memo, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';

import { useI18n } from '@/store/i18n';

import { RegisterParamsType } from './data.d';
import { accountReg } from './service';

import style from './index.module.less';
import { BasicContext } from '@/store/context';

export default memo(() => {
  const navigate = useNavigate();

  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);

  const [loginStatus, setLoginStatus] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  // 注册
  const handleSubmit = async (values: RegisterParamsType) => {
    setSubmitLoading(true);
    try {
      await accountReg(values);
      setLoginStatus('');
      message.success(t('page.user.register.form.register-success'));
      navigate('/user/login', { replace: true });
    } catch (error: any) {
      if (error.message && error.message === 'CustomError') {
        const { response } = error;
        const { data } = response;
        setLoginStatus(data.msg || 'error');
      }
      message.warning(t('app.global.form.validatefields.catch'));
      console.log('error', error);
    }
    setSubmitLoading(false);
  };

  return (
    <div className={style.main}>
      <h1 className={style.title}>{t('page.user.register.form.title')}</h1>
      <Form name='basic' onFinish={handleSubmit}>
        <Form.Item
          label=''
          name='username'
          rules={[
            {
              required: true,
              message: t('page.user.register.form-item-username.required'),
            },
          ]}
        >
          <Input placeholder={t('page.user.register.form-item-username')} prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          label=''
          name='password'
          rules={[
            {
              required: true,
              message: t('page.user.register.form-item-password.required'),
            },
          ]}
        >
          <Input.Password
            placeholder={t('page.user.register.form-item-password')}
            prefix={<LockOutlined />}
            autoComplete=''
          />
        </Form.Item>

        <Form.Item
          label=''
          name='confirm'
          rules={[
            {
              required: true,
              message: t('page.user.register.form-item-password.required'),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(t('page.user.register.form-item-confirmpassword.compare'));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder={t('page.user.register.form-item-confirmpassword')}
            prefix={<LockOutlined />}
            autoComplete=''
          />
        </Form.Item>

        <Form.Item>
          <Button type='primary' className={style.submit} htmlType='submit' loading={false}>
            {t('page.user.register.form.btn-submit')}
          </Button>
          <div className={style['text-align-right']}>
            <Link to='/user/login'>{t('page.user.register.form.btn-jump')}</Link>
          </div>
        </Form.Item>

        {loginStatus !== '' && !submitLoading && <Alert message={loginStatus} type='error' showIcon />}
      </Form>
    </div>
  );
});
