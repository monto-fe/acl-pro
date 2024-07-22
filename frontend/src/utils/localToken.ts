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
  console.log(token)
  //  { secure: true, sameSite: 'strict' }
  Cookies.set(settings.siteTokenKey, token);
};

/**
 * 移除本地Token
 */
export const removeToken = () => {
  Cookies.remove(settings.siteTokenKey);
};
