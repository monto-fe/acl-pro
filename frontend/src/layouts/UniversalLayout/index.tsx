import { memo, useContext, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Flex, Layout, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';

import { BasicContext } from '@/store/context';
import { useI18n } from '@/store/i18n';

import { formatRoutes, getBreadcrumbRoutes } from '@/utils/router';

import Permission from '@/components/Permission';
import LeftSider from './components/LeftSider';
import RightTop from './components/RightTop';
import RightFooter from './components/RightFooter';
import RightTopNavTabs from './components/RightTopNavTabs';
import layoutRotes from './routes';

import useTitle from '@/hooks/useTitle';

import './css/index.less';

const { Header, Sider, Content, Footer } = Layout;

export interface UniversalLayoutProps {
  children: React.ReactNode;
}

export default memo(observer(({ children }: UniversalLayoutProps) => {
  const location = useLocation();
  const context = useContext(BasicContext) as any;
  const { i18nLocale, user, globalConfig } = context.storeContext;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
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

  const updateCollapsed = (collapsed: boolean) => {
    context.storeContext.updateGlobalConfig({
      ...globalConfig,
      collapsed,
    });
  }

  // 设置title
  useTitle(t(routeItem?.meta?.title || ''));

  const getHeaderStyle = useMemo(() => {
    return globalConfig.navMode === 'inline' ? (
      globalConfig.theme === 'all-dark' ? '#001529' : colorBgContainer
    ) : (
      globalConfig.theme === 'light' ? colorBgContainer : '#001529'
    )
  }, [globalConfig.navMode, globalConfig.theme]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {globalConfig.navMode === 'inline' ? (
        <Sider collapsible trigger={null} collapsed={globalConfig.collapsed} theme={globalConfig.theme}>
          <LeftSider
            collapsed={globalConfig.collapsed}
            userRoles={user.roleList}
            menuData={routerPathKeyRouter.router}
            routeItem={routeItem}
            theme={globalConfig.theme}
          />
        </Sider>
      ) : null}
      <Layout id='universallayout-right-main'>
        <Header style={{ padding: 0, background: getHeaderStyle }} className={classnames({
          fixed: globalConfig.headFixed,
          collapsed: globalConfig.collapsed,
          horizontal: globalConfig.navMode === 'horizontal',
        })}>
          <Flex style={{ height: 64, width: '100%' }}>
            {globalConfig.navMode === 'inline' ? (
              <Button
                type="text"
                icon={globalConfig.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => updateCollapsed(!globalConfig.collapsed)}
                style={{
                  fontSize: '16px',
                  width: 64,
                  height: 64,
                }}
              />
            ) : null}
            <RightTop
              userRoles={user.roleList}
              menuData={routerPathKeyRouter.router}
              routeItem={routeItem}
              breadCrumbs={breadCrumbs}
            />
          </Flex>
        </Header>
        <Content
          style={{
            padding: 24,
            borderRadius: borderRadiusLG,
          }}
          className={classnames({
            headerfixed: globalConfig.headFixed,
            horizontal: globalConfig.navMode === 'horizontal',
          })}
        >
          <Permission role={routeItem?.meta?.roles}>
            {globalConfig.tabNavEnable ? (
              <RightTopNavTabs currentRouter={routeItem} breadCrumbs={breadCrumbs} />
            ) : null}
            {/* 路由的插槽 */}
            {children}
          </Permission>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          <RightFooter />
        </Footer>
      </Layout>
    </Layout>
  );
}));
