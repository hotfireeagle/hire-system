﻿/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: "/user",
    layout: false,
    routes: [
      {
        name: "login",
        path: "/user/login",
        component: "./user/login",
      },
    ],
  },
  {
    path: "/503",
    layout: false,
    component: "./404", // TODO:
  },
  {
    path: "/homepage",
    name: "首页",
    icon: "smile",
    component: "./homepage",
  },
  // TODO: 移到配置管理路由下
  {
    path: "/bannerModule",
    name: "横幅配置",
    icon: "smile",
    component: "./bannerModule",
    access: "banner管理",
  },
  {
    path: "/configure",
    name: "配置管理",
    icon: "control",
    access: "配置管理",
    routes: [
      {
        path: "/configure/category",
        name: "分类配置",
        component: "./categoryModule",
        access: "分类配置",
      },
      {
        path: "/configure/tofucube",
        name: "豆腐块配置",
        component: "./tofuModule",
        access: "豆腐块配置",
      }
    ],
  },
  {
    path: "/permissionModule",
    name: "权限管理",
    icon: "safety",
    access: "权限管理",
    routes: [
      {
        path: "/permissionModule/role",
        name: "角色管理",
        component: "./roleModule/list",
        access: "角色管理",
      },
      {
        path: "/permissionModule/role/new",
        name: "新增角色",
        component: "./roleModule/form",
        hideInMenu: true,
      },
      {
        path: "/permissionModule/role/detail/:id",
        name: "角色详情",
        component: "./roleModule/form",
        hideInMenu: true,
      },
      {
        path: "/permissionModule/account",
        name: "成员管理",
        component: "./accountModule/list",
        access: "成员管理",
      },
      {
        path: "/permissionModule/account/new",
        name: "新增成员",
        component: "./accountModule/form",
        hideInMenu: true,
      },
      {
        path: "/permissionModule/account/detail/:accountId",
        name: "成员详情",
        component: "./accountModule/form",
        hideInMenu: true,
      }
    ],
  },
  {
    path: "/",
    redirect: "/homepage",
  },
  {
    path: "*",
    layout: false,
    component: "./404",
  },
]