import { memo, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dropdown } from 'antd';

import { useI18n } from '@/store/i18n';

import { removeToken } from '@/utils/localToken';

import IconSvg from '@/components/IconSvg';
import { BasicContext } from '@/store/context';
import { observer } from 'mobx-react-lite';

export default memo(observer(() => {
  const context = useContext(BasicContext) as any;
  const { i18nLocale, user } = context.storeContext;
  const t = useI18n(i18nLocale);
  const navigate = useNavigate();

  const onMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (key === 'logout') {

        removeToken();
        navigate('/user/login', {
          replace: true,
        });
      }
    },
    [],
  );
  return (
    <Dropdown
      trigger={['hover']}
      menu={{
        items: [
          {
            key: 'userinfo',
            label: <>{t('universal-layout.topmenu.userinfo')}</>,
          },
          {
            key: 'logout',
            label: <>{t('universal-layout.topmenu.logout')}</>,
          },
        ],
        onClick: onMenuClick
      }}
    >
      <div className='universallayout-top-usermenu ant-dropdown-link cursor' onClick={(e) => e.preventDefault()}>
        <span className='username'>{user.name}</span>
        <IconSvg name='arrow-down' />
      </div>
    </Dropdown>
  );
}));
