import { memo, Suspense, useContext } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import IconSvg from '@/components/IconSvg';
import BreadCrumbs from '@/components/BreadCrumbs';
import SelectLang from '@/components/SelectLang';

import logo from '@/assets/images/logo.png';
import RightTabNav from './RightTabNav';
import SiderMenu from './SiderMenu';
import RightTopUser from './RightTopUser';
import RightTopMessage from './RightTopMessage';

import Settings from './Settings';

import { IRouter, IPathKeyRouter, BreadcrumbType } from '@/@types/router';
import { BasicContext } from '@/store/context';
import { IRoleInfo } from '@/@types/permission';
// import { useI18n } from '@/store/i18n';

export interface RightTopProps {
  menuData: IRouter[];
  jsonMenuData: IPathKeyRouter;
  routeItem: IRouter;
  userRoles?: IRoleInfo[];
  breadCrumbs?: BreadcrumbType[];
}

export default memo(({ menuData, jsonMenuData, routeItem, userRoles = [], breadCrumbs = [] }: RightTopProps) => {
  const storeContext = (useContext(BasicContext) as any).storeContext;
  const { globalConfig } = storeContext;
  // const t = useI18n(i18nLocale);

  const toggleCollapsed = () => {
    storeContext.updateGlobalConfig({ ...globalConfig, collapsed: !globalConfig.collapsed });
  };

  return (
    <div
      id='universallayout-right-top'
      className={classnames({
        fixed: globalConfig.headFixed,
        narrow: globalConfig.collapsed,
        tabNavEnable: !globalConfig.tabNavEnable,
        navModeHorizontal: globalConfig.navMode === 'horizontal',
      })}
    >
      <div className='universallayout-right-top-header'>
        {globalConfig.navMode === 'inline' ? (
          <div className='universallayout-right-top-top'>
            <div className='universallayout-flexible' onClick={toggleCollapsed}>
              {globalConfig.collapsed ? <IconSvg name='menu-unfold'></IconSvg> : <IconSvg name='menu-fold'></IconSvg>}
            </div>
            <div className='universallayout-top-menu'>
              <BreadCrumbs className='breadcrumb' list={breadCrumbs} />
            </div>
            <div className='universallayout-top-menu-right'>
              <Suspense fallback={<>...</>}>
                <RightTopMessage />
              </Suspense>
              <RightTopUser />
              <SelectLang className='universallayout-top-selectlang' />
              <Settings />
            </div>
          </div>
        ) : (
          <div className='universallayout-right-top-top menu'>
            <div className='universallayout-right-top-logo'>
              <Link to='/' className='logo-url'>
                <img alt='' src={logo} width='30' />
                <h3 className='logo-title'>Monto-Acl</h3>
              </Link>
            </div>
            <div className='universallayout-top-menu'>
              <SiderMenu
                userRoles={userRoles}
                menuData={menuData}
                routeItem={routeItem}
                theme={globalConfig.theme}
                mode='horizontal'
              />
            </div>
            <div className='universallayout-top-menu-right'>
              <Suspense fallback={<>...</>}>
                <RightTopMessage />
              </Suspense>
              <RightTopUser />
              <SelectLang className='universallayout-top-selectlang' />
              <Settings />
            </div>
          </div>
        )}
        {globalConfig.tabNavEnable && <RightTabNav routeItem={routeItem} jsonMenuData={jsonMenuData} />}
      </div>
    </div>
  );
});
