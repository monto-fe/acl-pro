import request from '@/utils/request';
import { TableListQueryParams, TableListItem } from './data.d';

const namespace = 'acl';

export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: `/user?namespace=${namespace}`,
    method: 'get',
    params,
  });
}

export async function createData(params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: '/pages/list',
    method: 'POST',
    data: params,
  });
}

export async function updateData(id: number, params: Omit<TableListItem, 'id'>): Promise<any> {
  return request({
    url: `/pages/list/${id}`,
    method: 'PUT',
    data: params,
  });
}

export async function removeData(id: number, user: string): Promise<any> {
  return request({
    url: `/user`,
    method: 'delete',
    data: {
      id,
      user,
      namespace
    },
  });
}
