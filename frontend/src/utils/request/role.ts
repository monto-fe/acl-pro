import req from './req';

export function getRoleList({ role }: { role?: string } = {}) {
  return req.get(`role?namespace=acl${role ? '&role=' + role : ''}`);
}

export function addRole({ role, name, describe }: { role: string, name: string, describe: string }) {
  return req.post(`role`, {
    namespace: 'acl',
    role, name, describe
  })
}

export function updateRole({ id, role, name, describe }: { id: number, role: string, name: string, describe: string }) {
  return req.put(`role`, {
    namespace: 'acl',
    role, name, describe, id
  })
}

export function deleteRole({ role }: { role: string }) {
  return req.delete(`role`, {
    data: {
      namespace: 'acl',
      role
    }
  })
}