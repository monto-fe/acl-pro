/**
 * 站点配置
 * @author duheng1992
 */
import { SettingsType } from '@/@types/settings.d';

const settings: SettingsType = {
  siteTitle: 'Monto-Acl',

  siteTokenKey: 'monto_acl_react_token',
  ajaxHeadersTokenKey: 'jwt_token',
  ajaxResponseNoVerifyUrl: [
    '/login', // 用户登录
    '/userInfo', // 获取用户信息
  ],

  /* 以下是针对所有 Layout 扩展字段 */
  headFixed: true,
  theme: 'dark',
  leftSiderFixed: true,

  /* 以下是针对 UniversalLayout 扩展字段 */
  tabNavEnable: true,
  tabNavHomePath: '/home/workplace',
  navMode: 'inline',
};

export default settings;
