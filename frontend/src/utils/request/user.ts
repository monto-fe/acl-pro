import req from './req';

export function login({ user, password }: { user: string, password: string }) {
  return req.post(`login`, {
    namespace: 'acl',
    user, password
  })
}