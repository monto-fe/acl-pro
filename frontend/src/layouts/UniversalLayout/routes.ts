/**
 * UniversalLayout 路由配置 入口
 * @author duheng1992
 */

import { lazy } from 'react';

import {
  HomeOutlined,
  DashboardOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
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
      {
        path: 'custombreadcrumbs',
        meta: {
          icon: DashboardOutlined,
          title: 'universal-layout.menu.home.custom-breadcrumbs',
          breadcrumb: [
            {
              title: 'universal-layout.menu.home.custom-breadcrumbs',
              path: '/home/custombreadcrumbs',
            },
            {
              title: 'universal-layout.menu.home',
              path: '/home',
            },
            {
              title: 'universal-layout.menu.home.custom-breadcrumbs.montoacl.cc',
              path: 'http://montoacl.cc',
            },
          ],
          tabNavCloseBefore: (close: () => void): void => {
            // eslint-disable-next-line no-alert
            if (window.confirm('确认关闭吗')) {
              close();
            }
          },
        },
        component: lazy(() => import('@/pages/CustomBreadcrumbs')),
      },
      {
        path: 'http://admin-antd-react.montoacl.cc/',
        meta: {
          icon: DashboardOutlined,
          title: 'universal-layout.menu.home.docs',
          selectLeftMenu: '/home',
        },
      },
    ],
  },
  {
    path: '/component',
    redirect: '/component/icon/svg',
    meta: {
      icon: BarChartOutlined,
      title: 'universal-layout.menu.component',
    },
    children: [
      {
        path: 'icon',
        redirect: '/component/icon/svg',
        meta: {
          icon: BarChartOutlined,
          title: 'universal-layout.menu.component.icon',
        },
        children: [
          {
            path: 'svg',
            meta: {
              title: 'universal-layout.menu.component.icon.svg',
            },
            component: lazy(() => import('@/pages/component/icon/svg')),
          },
        ],
      },
      {
        path: 'editor',
        redirect: '/component/editor/tuieditor',
        meta: {
          icon: BarChartOutlined,
          title: 'universal-layout.menu.component.editor',
        },
        children: [
          {
            path: 'tuieditor',
            meta: {
              title: 'universal-layout.menu.component.editor.tui-editor',
            },
            component: lazy(() => import('@/pages/component/editor/TuiEditor')),
          },
          {
            path: 'ckeditor',
            meta: {
              title: 'universal-layout.menu.component.editor.ckeditor',
            },
            component: lazy(() => import('@/pages/component/editor/ckeditor')),
          },
        ],
      },
    ],
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
