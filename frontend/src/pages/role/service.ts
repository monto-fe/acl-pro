import request from '@/utils/request';
import { TableQueryParam, TableListItem, Permission } from './data.d';

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
    method: 'post',
    data: {
      ...params,
      namespace
    },
  });
}

export async function updateData(params: TableListItem): Promise<any> {
  return request({
    url: `/role`,
    method: 'put',
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

export async function assertRolePermission(id: number, permissions: Permission[]): Promise<any> {
  return request({
    url: `/role/permission`,
    method: 'post',
    data: {
      id,
      permissions
    },
  });
}
