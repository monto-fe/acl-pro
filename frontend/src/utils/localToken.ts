/**
 * 自定义 token 操作
 * @author duheng1992
 */
import Cookies from "js-cookie";
import settings from '@/config/settings';

/**
 * 获取本地
 */
export const getToken = () => Cookies.get(settings.siteTokenKey);

/**
 * 设置存储本地
 */
export const setToken = (token: string) => {
  // https 下应设置 { secure: true, sameSite: 'strict' }
  Cookies.set(settings.siteTokenKey, token, { secure: true });
};

/**
 * 移除本地Token
 */
export const removeToken = () => {
  Cookies.remove(settings.siteTokenKey);
};
