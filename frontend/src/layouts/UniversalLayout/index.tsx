import { memo, useContext, useMemo } from 'react';
import { /* Outlet, */ useLocation } from 'react-router-dom';
import classnames from 'classnames';

import { BasicContext } from '@/store/context';
import { useI18n } from '@/store/i18n';

import { formatRoutes, getBreadcrumbRoutes } from '@/utils/router';

import Permission from '@/components/Permission';
import LeftSider from './components/LeftSider';
import RightTop from './components/RightTop';
import RightFooter from './components/RightFooter';
import layoutRotes from './routes';

import useTitle from '@/hooks/useTitle';

import './css/index.less';
import { observer } from 'mobx-react-lite';

export interface UniversalLayoutProps {
  children: React.ReactNode;
}

export default memo(observer(({ children }: UniversalLayoutProps) => {
  const location = useLocation();
  const context = useContext(BasicContext) as any;
  const { i18nLocale, user, globalConfig } = context.storeContext;

  const t = useI18n(i18nLocale);

  // 框架所有菜单路由 与 patch key格式的所有菜单路由
  const routerPathKeyRouter = useMemo(() => formatRoutes(layoutRotes), []);

  // 当前路由item
  const routeItem = useMemo(() => routerPathKeyRouter.pathKeyRouter[location.pathname], [location]);

  // 面包屑导航
  const breadCrumbs = useMemo(
    () =>
      getBreadcrumbRoutes(location.pathname, routerPathKeyRouter.pathKeyRouter).map((item) => ({
        ...item,
        title: t(item.title),
      })),
    [location, routerPathKeyRouter, t],
  );

  // 设置title
  useTitle(t(routeItem?.meta?.title || ''));

  return (
    <div id='universallayout' className={classnames({ light: globalConfig.theme === 'light' })}>
      {globalConfig.navMode === 'inline' && (
        <LeftSider
          collapsed={globalConfig.collapsed}
          userRoles={user.roleList}
          menuData={routerPathKeyRouter.router}
          routeItem={routeItem}
          theme={globalConfig.theme}
          leftSiderFixed={globalConfig.leftSiderFixed}
        />
      )}
      <div id='universallayout-right'>
        <RightTop
          userRoles={user.roleList}
          menuData={routerPathKeyRouter.router}
          jsonMenuData={routerPathKeyRouter.pathKeyRouter}
          routeItem={routeItem}
          breadCrumbs={breadCrumbs}
        />
        <div id='universallayout-right-main'>
          <button onClick={() => {
            context.storeContext.updateGlobalConfig({ ...globalConfig, collapsed: !globalConfig.collapsed });
          }}>sfcsdfcsdfc</button>
          <Permission role={routeItem?.meta?.roles}>
            {/* <Outlet /> */}
            {children}
          </Permission>
          <RightFooter />
        </div>
      </div>
    </div>
  );
}));
