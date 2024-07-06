import req from './req';

export function getPermissionSourceList() {
  return req.get(`resource?namespace=acl`);
}

export function addPermissionSource({ resource, category, properties, name, describe }: { resource: string, category: string, name: string, properties: string,  describe: string }) {
  return req.post(`resource`, {
    namespace: 'acl',
    resource, category, properties, name, describe
  })
}

export function updatePermissionSource({ id, resource, category, properties, name, describe }: { id: number, resource: string, category: string, name: string, properties: string,  describe: string }) {
  return req.put(`resource`, {
    namespace: 'acl',
    resource, category, properties, name, describe, id
  })
}

export function deletePermissionSource({ resource }: { resource: string }) {
  return req.delete(`resource`, {
    data: {
      namespace: 'acl',
      resource
    }
  })
}