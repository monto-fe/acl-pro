'use client';
import React, { useState, useEffect } from 'react';
import { Layout, Menu, theme, Avatar, Dropdown, ConfigProvider, Badge, Popover, type MenuProps, Button } from 'antd';
import getNavList from './menu';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import {
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  TransactionOutlined
} from '@ant-design/icons';
import { getThemeBg } from '@/utils';
import { Link, pathnames, usePathname } from '../../navigation';
import styles from './index.module.less';

const { Header, Content, Footer, Sider } = Layout;

interface IProps {
  children: React.ReactNode,
  curActive: string,
  defaultOpen?: string[]
}

const onLogout = () => {
  localStorage.removeItem("isDarkTheme")
}

const CommonLayout: React.FC<IProps> = ({ children, curActive, defaultOpen = ['/acl'] }) => {
  const {
    token: { borderRadiusLG },
  } = theme.useToken();
  const t = useTranslations('head');

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          {t('profile')}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="#">
          {t('logout')}
        </a>
      ),
    },
  ];

  const locale = useLocale();
  const otherLocale: any = locale === 'en' ? ['zh', '中'] : ['en', 'En'];

  const router = useRouter();
  const pathname = usePathname();
  const navList = getNavList(useTranslations('acl'));

  const [curTheme, setCurTheme] = useState<boolean>(false);
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleTheme = () => {
    const _curTheme = !curTheme;
    setCurTheme(_curTheme);
    localStorage.setItem('isDarkTheme', _curTheme ? 'true' : '');
  }

  const handleSelect = (row: { key: string }) => {
    router.push(row.key)
  }

  useEffect(() => {
    const isDark = !!localStorage.getItem("isDarkTheme");
    setCurTheme(isDark);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: curTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          theme={curTheme ? "dark" : "light"}
          width={220}
          breakpoint="lg"
          collapsible
          collapsed={collapsed}
          reverseArrow
          onCollapse={(value) => setCollapsed(value)}
        >
          <span className={styles.logo} style={getThemeBg(curTheme)}>{collapsed ? 'MA' : 'Monto-ACL'}</span>
          <Menu
            theme={curTheme ? "dark" : "light"}
            mode="inline"
            defaultSelectedKeys={[curActive]}
            defaultOpenKeys={defaultOpen}
            items={navList}
            onSelect={handleSelect}
          />
        </Sider>
        <Layout>
          <Header style={{ padding: 0, ...getThemeBg(curTheme), display: 'flex' }}>
            <div className={styles.rightControl}>
              <span className={styles.group}>
                <Popover content={<div style={{ width: '100%' }}><img src="/tech.png" /></div>} title="技术交流&分享">
                  {t('technological exchanges')}
                </Popover>
              </span>
              <span className={styles.group}>
                <Popover content={<div style={{ width: '100%' }}><img width={180} src="/pay.png" /></div>} title="开源不易，支持作者">
                  <TransactionOutlined style={{ color: 'red' }} /> {t('buy me acoffee')}
                </Popover>
              </span>
              <span className={styles.msg}>
                <Badge dot>
                  <BellOutlined />
                </Badge>
              </span>
              <Link href={pathname as any} locale={otherLocale[0]} className={styles.i18n} style={{ color: getThemeBg(curTheme).color }}>
                {otherLocale[1]}
              </Link>
              <span onClick={toggleTheme} className={styles.theme}>
                {
                  !curTheme ? <SunOutlined /> : <MoonOutlined />
                }
              </span>
              <div className={styles.avatar}>
                <Dropdown menu={{ items }} placement="bottomLeft" arrow>
                  <Avatar src="/avatar.png" />
                </Dropdown>
              </div>
            </div>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div
              style={{
                padding: 24,
                minHeight: 520,
                ...getThemeBg(curTheme),
                borderRadius: borderRadiusLG,
              }}
            >
              {children}
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Monto-ACL ©{new Date().getFullYear()} Created by <a href="https://github.com/duheng1992">heng.du</a>
          </Footer>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default CommonLayout;