import {
  TeamOutlined,
  UserOutlined,
  OrderedListOutlined,
  VerifiedOutlined,
} from '@ant-design/icons';
import React from 'react';

const getNavList = (t: any) => {
  return [
    {
      key: '/acl',
      icon: <TeamOutlined />,
      label: t('userManage'),
      children: [
        {
          key: '/acl/user',
          icon: <OrderedListOutlined />,
          label: t('userList'),
        },
        {
          key: '/acl/role',
          icon: <UserOutlined />,
          label: t('userRole'),
        },
        {
          key: '/acl/permissions',
          icon: <VerifiedOutlined />,
          label: t('permissions'),
        }
      ]
    },
  ]
}

export default getNavList