import request from '@/utils/request';
import { TableQueryParam, TableListItem } from './data.d';

const namespace = 'acl';

export async function queryList(params?: TableQueryParam): Promise<any> {
  return request({
    url: `/role?namespace=${namespace}`,
    method: 'get',
    params,
  });
}

export async function createData(params: TableListItem): Promise<any> {
  return request({
    url: '/role',
    method: 'POST',
    data: {
      ...params,
      namespace
    },
  });
}

export async function updateData(params: TableListItem): Promise<any> {
  return request({
    url: `/role`,
    method: 'PUT',
    data: {
      ...params,
      namespace,
    },
  });
}

export async function removeData(id: number): Promise<any> {
  return request({
    url: `/role`,
    method: 'delete',
    data: {
      id,
      namespace
    },
  });
}