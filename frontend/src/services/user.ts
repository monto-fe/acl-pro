import request from '@/utils/request';

export async function queryCurrent(): Promise<any> {
  return request({
    url: '/userInfo',
    method: 'get',
  });
}

export async function queryMessage(): Promise<any> {
  return request({
    url: '/user/message',
  });
}
