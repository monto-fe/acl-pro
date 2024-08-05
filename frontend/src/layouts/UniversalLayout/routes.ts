/**
 * UniversalLayout 路由配置 入口
 * @author duheng1992
 */

import { lazy } from 'react';

import {
  HomeOutlined,
  DashboardOutlined,
  InsuranceOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined
} from '@ant-design/icons';

import { IRouter } from '@/@types/router.d';

const universalLayoutRotes: IRouter[] = [
  {
    path: '/home',
    meta: {
      icon: HomeOutlined,
      title: 'universal-layout.menu.home',
    },
    redirect: '/home/workplace',
    children: [
      {
        path: 'workplace',
        meta: {
          icon: DashboardOutlined,
          title: 'universal-layout.menu.home.workplace',
        },
        component: lazy(() => import('@/pages/Home')),
      },
    ],
  },
  {
    path: 'https://chromewebstore.google.com/detail/%E5%A4%9A%E5%BD%A9%E4%B9%A6%E7%AD%BE/ilcmekmgeldhckdembghkiohkdffihpe?hl=zh-CN&utm_source=ext_sidebar',
    meta: {
      icon: DashboardOutlined,
      title: 'universal-layout.menu.home.bookmark',
      selectLeftMenu: '/home',
    },
  },
  {
    path: 'https://chromewebstore.google.com/detail/%E6%97%B6%E9%97%B4%E6%88%B3%E8%BD%AC%E6%8D%A2-%E6%97%B6%E5%8C%BA%E6%97%B6%E9%92%9F/pjcapgdifnhgkkojoggfdlijpelpohcf?hl=zh-CN&utm_source=ext_sidebar',
    meta: {
      icon: DashboardOutlined,
      title: 'universal-layout.menu.home.timestamp',
      selectLeftMenu: '/home',
    },
  },
  {
    path: '/acl',
    redirect: '/acl/user',
    meta: {
      icon: InsuranceOutlined,
      title: 'universal-layout.menu.roles',
      roles: ['admin'],
    },
    children: [
      {
        path: 'user',
        meta: {
          icon: UserOutlined,
          title: 'universal-layout.menu.roles.user',
        },
        component: lazy(() => import('@/pages/user/list')),
      },
      {
        path: 'role',
        meta: {
          icon: TeamOutlined,
          title: 'universal-layout.menu.roles.role',
        },
        component: lazy(() => import('@/pages/role/list')),
      },
      {
        path: 'resource',
        meta: {
          icon: KeyOutlined,
          title: 'universal-layout.menu.roles.resource',
        },
        component: lazy(() => import('@/pages/resource/list')),
      },
    ],
  },
];

export default universalLayoutRotes;
