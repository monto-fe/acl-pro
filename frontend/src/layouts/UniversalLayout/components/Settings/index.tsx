import { memo, useContext } from 'react';
import { Popover, Divider, Switch } from 'antd';
import classnames from 'classnames';

import IconSvg from '@/components/IconSvg';

import { Theme, NavMode } from '@/@types/settings';

import style from './index.module.less';
import { BasicContext } from '@/store/context';

export default memo(() => {
  const storeContext = (useContext(BasicContext) as any).storeContext;
  const { globalConfig } = storeContext;
  
  // 模板主题
  const setTheme = (theme: Theme) => {
    storeContext.updateGlobalConfig({ ...globalConfig, theme });
  };

  // 导航模式
  const setNavMode = (navMode: NavMode) => {
    storeContext.updateGlobalConfig({ ...globalConfig, navMode });
  };

  // 固定头部
  const onChangeHeadFixed = () => {
    storeContext.updateGlobalConfig({ ...globalConfig, headFixed: !globalConfig.headFixed });
  };

  // tabNavEnable
  const onChangeTabNavEnable = () => {
    storeContext.updateGlobalConfig({ ...globalConfig, tabNavEnable: !globalConfig.tabNavEnable });
  };

  // 固定左侧
  const onChangeLeftSiderFixed = () => {
    storeContext.updateGlobalConfig({ ...globalConfig, leftSiderFixed: !globalConfig.leftSiderFixed });
  };
  return (
    <Popover
      content={
        <div className={style.setting}>
          <div className={style['setting-title']}>页面风格</div>

          <div className={style['setting-radio']}>
            <div
              className={classnames(style['setting-radio-item'], style['style-dark'])}
              title='dark'
              onClick={() => {
                setTheme('dark');
              }}
            >
              {globalConfig.theme === 'dark' && (
                <span className={style['choose-icon']}>
                  <IconSvg name='tick' />
                </span>
              )}
            </div>
            <div
              className={classnames(style['setting-radio-item'], style['style-light'])}
              title='light'
              onClick={() => {
                setTheme('light');
              }}
            >
              {globalConfig.theme === 'light' && (
                <span className={style['choose-icon']}>
                  <IconSvg name='tick' />
                </span>
              )}
            </div>
          </div>

          <Divider style={{ margin: '10px 0' }} />

          <div className={style['setting-title']}>导航模式</div>
          <div className={style['setting-radio']}>
            <div
              className={classnames(style['setting-radio-item'], style['nav-inline'])}
              title='inline'
              onClick={() => {
                setNavMode('inline');
              }}
            >
              {globalConfig.navMode === 'inline' && (
                <span className={style['choose-icon']}>
                  <IconSvg name='tick' />
                </span>
              )}
            </div>
            <div
              className={classnames(style['setting-radio-item'], style['nav-horizontal'])}
              title='horizontal'
              onClick={() => {
                setNavMode('horizontal');
              }}
            >
              {globalConfig.navMode === 'horizontal' && (
                <span className={style['choose-icon']}>
                  <IconSvg name='tick' />
                </span>
              )}
            </div>
          </div>

          <Divider style={{ margin: '10px 0' }} />

          <div className={style['setting-list']}>
            <div className={style['setting-list-item']}>
              <span>固定头部</span>
              <span className={style['setting-list-item-action']}>
                <Switch
                  checkedChildren='开启'
                  unCheckedChildren='关闭'
                  checked={globalConfig.headFixed}
                  onChange={onChangeHeadFixed}
                />
              </span>
            </div>
            <div className={style['setting-list-item']}>
              <span>TabNav</span>
              <span className={style['setting-list-item-action']}>
                <Switch
                  checkedChildren='开启'
                  unCheckedChildren='关闭'
                  checked={globalConfig.tabNavEnable}
                  onChange={onChangeTabNavEnable}
                />
              </span>
            </div>
            <div className={style['setting-list-item']}>
              <span>固定侧边</span>
              <span className={style['setting-list-item-action']}>
                <Switch
                  checkedChildren='开启'
                  unCheckedChildren='关闭'
                  checked={globalConfig.leftSiderFixed}
                  onChange={onChangeLeftSiderFixed}
                />
              </span>
            </div>
          </div>
        </div>
      }
      trigger='hover'
      placement='bottomRight'
    >
      <span className='universallayout-top-settings'>
        <IconSvg name='theme' />
      </span>
    </Popover>
  );
});