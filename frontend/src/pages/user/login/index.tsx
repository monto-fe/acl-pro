import { memo, useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Form, Input, message } from 'antd';
import { observer } from 'mobx-react-lite';

import { useI18n } from '@/store/i18n';

import IconSvg from '@/components/IconSvg';

import { setToken } from '@/utils/localToken';
import { ResponseData } from '@/utils/request';
import { LoginParamsType, LoginResponseData } from './data.d';
import { accountLogin } from './service';

import style from './index.module.less';
import { BasicContext } from '@/store/context';

export default memo(observer(() => {
  const navigate = useNavigate();

  const context = useContext(BasicContext) as any;
  const { i18nLocale } = context.storeContext;
  const t = useI18n(i18nLocale);
  const [loginStatus, setLoginStatus] = useState<string>('');
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  // 登录
  const handleSubmit = async (values: LoginParamsType) => {
    setSubmitLoading(true);
    try {
      const response: ResponseData<LoginResponseData> = await accountLogin(values);
      const { data } = response;
      setToken(data?.jwt_token || '');
      setLoginStatus('ok');
      message.success(t('page.user.login.form.login-success'));
      navigate('/', { replace: true });
    } catch (error: any) {
      if (error.message && error.message === 'CustomError') {
        setLoginStatus('error');
      }
    }
    setSubmitLoading(false);
  };

  return (
    <div className={style.main}>
      <h1 className={style.title}>{t('page.user.login.form.title')}</h1>
      <Form name='basic' onFinish={handleSubmit}>
        <Form.Item
          label=''
          name='user'
          rules={[
            {
              required: true,
              message: t('page.user.login.form-item-username.required'),
            },
          ]}
        >
          <Input placeholder={t('page.user.login.form-item-username')} prefix={<IconSvg name='user' />} />
        </Form.Item>
        <Form.Item
          label=''
          name='password'
          rules={[
            {
              required: true,
              message: t('page.user.login.form-item-password.required'),
            },
          ]}
        >
          <Input.Password
            placeholder={t('page.user.login.form-item-password')}
            prefix={<IconSvg name='pwd' />}
            autoComplete=''
          />
        </Form.Item>

        <Form.Item>
          <Button type='primary' className={style.submit} htmlType='submit' loading={false}>
            {t('page.user.login.form.btn-submit')}
          </Button>
          {/* <div className={style['text-align-right']}>
            <Link to='/user/register'>{t('page.user.login.form.btn-jump')}</Link>
          </div> */}
        </Form.Item>

        {loginStatus === 'error' && !submitLoading && (
          <Alert message={t('page.user.login.form.login-error')} type='error' showIcon />
        )}
      </Form>
    </div>
  );
}));
