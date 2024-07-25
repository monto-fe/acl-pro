import { memo, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Flex, Menu, theme as antdTheme } from 'antd';
import { ItemType } from 'antd/lib/menu/interface';
import { MenuTheme } from 'antd/lib';
import classnames from 'classnames';

import logo from '@/assets/images/logo.png';

import { IRouter } from '@/@types/router';
import { IRoleInfo } from '@/@types/permission';
import ALink from '@/components/ALink';
import { isExternal } from '@/utils/validate';
import { hasPermissionRoles } from '@/utils/router';
import { useI18n } from '@/store/i18n';
import { BasicContext } from '@/store/context';

export interface LeftSiderProps {
  menuData: IRouter[];
  routeItem: IRouter;
  userRoles?: IRoleInfo[];
  collapsed?: boolean;
  theme?: MenuTheme;
  leftSiderFixed?: boolean;
  mode?: 'inline' | 'horizontal';
}

const createMenuItems = (
  t: (key: string) => string,
  userRoles: IRoleInfo[],
  routes: IRouter[],
  parentPath = '/',
): ItemType[] => {
  const items: ItemType[] = [];

  for (let index = 0; index < routes.length; index++) {
    const item = routes[index];

    // 验证权限
    if (!hasPermissionRoles(userRoles, item.meta?.roles)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const Icon = item.meta?.icon || undefined;
    const hidden = item.meta?.hidden || false;
    if (hidden === true) {
      // eslint-disable-next-line no-continue
      continue;
    }

    // 设置路径
    let path = item.path || '';
    if (!isExternal(item.path)) {
      path = item.path.startsWith('/')
        ? item.path
        : `${parentPath.endsWith('/') ? parentPath : `${parentPath}/`}${item.path}`;
    }

    const title = item.meta?.title || '--';

    if (item.children) {
      items.push({
        key: path,
        label: (
          <Flex align='center'>
            {Icon && (
              <Icon />
            )}
            <span>{t(title)}</span>
          </Flex>
        ),
        children: createMenuItems(t, userRoles, item.children, path),
      });
    } else {
      items.push({
        key: path,
        label: (
          <ALink to={path}>
            <Flex align='center'>
              {Icon && (
                <Icon />
              )}
              <span>{t(title)}</span>
            </Flex>
          </ALink>
        ),
      });
    }
  }

  return items;
};

export default memo(
  ({
    menuData,
    routeItem,
    userRoles = [],
    collapsed = false,
    theme = 'dark',
    mode = 'inline',
    leftSiderFixed = true,
  }: LeftSiderProps) => {
    const context = useContext(BasicContext) as any;
    const { i18nLocale, user, globalConfig } = context.storeContext;
    const t = useI18n(i18nLocale);
    const {
      token: { colorTextLightSolid, colorTextBase },
    } = antdTheme.useToken();

    return <div id='universallayout-left' className={classnames({ narrow: collapsed, fixed: leftSiderFixed })}>
      <div className='universallayout-left-sider'>
        {mode === 'inline' ? (
          <Flex align='center' justify='center' style={{ height: 64 }}>
            <Link to='/' style={{ color: theme === 'light' ? colorTextBase : colorTextLightSolid }}>
              {collapsed ? <img alt='' src={logo} width='30' /> : <h3 className='logo-title'>Monto-Acl</h3>}
            </Link>
          </Flex>
        ) : null}
        <div className='universallayout-left-menu'>
          <Menu
            theme={theme === 'light' ? 'light' : 'dark'}
            mode={mode}
            inlineCollapsed={collapsed}
            // selectedKeys={selectedKeys}
            // openKeys={openKeys}
            // onOpenChange={setOpenKeys}
            items={createMenuItems(t, userRoles, menuData)}
          />
        </div>
      </div>
    </div>
  }
);
