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