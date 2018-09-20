import Main from '@/view/main'
// import parentView from '@/components/parent-view'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          hideInMenu: true,
          notCache: true
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/set',
    name: 'set',
    meta: {
      icon: 'ios-cog',
      title: '全局基本配置'
    },
    component: Main,
    children: [
      {
        path: 'setting',
        name: 'setting',
        meta: {
          icon: 'ios-gear-outline',
          title: '配置'
        },
        component: () => import('@/view/set/setting.vue')
      },
      {
        path: 'setting_explain',
        name: 'setting_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/set/file-explain.vue')
      }
    ]
  },
  {
    path: '/sign',
    name: 'sign',
    meta: {
      icon: 'android-create',
      title: '签到管理'
    },
    component: Main,
    children: [
      {
        path: 'sign',
        name: 'sign',
        meta: {
          icon: 'android-checkbox-outline',
          title: '签到数据'
        },
        component: () => import('@/view/sign/sign.vue')
      },
      {
        path: 'joke',
        name: 'joke',
        meta: {
          icon: 'android-happy',
          title: '开心管理'
        },
        component: () => import('@/view/sign/joke.vue')
      },
      {
        path: 'setting_explain',
        name: 'setting_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/sign/file-explain.vue')
      }
    ]
  },
  {
    path: '/leave',
    name: 'leave',
    meta: {
      icon: 'chatbubbles',
      title: '留言管理'
    },
    component: Main,
    children: [
      {
        path: 'leave',
        name: 'leave',
        meta: {
          icon: 'android-square',
          title: '留言'
        },
        component: () => import('@/view/leave/leave.vue')
      },
      {
        path: 'setting_explain',
        name: 'setting_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/leave/file-explain.vue')
      }
    ]
  },
  {
    path: '/adminUser',
    name: 'adminUser',
    meta: {
      icon: 'android-person',
      title: '后台管理人员'
    },
    component: Main,
    children: [
      {
        path: 'admin',
        name: 'admin',
        meta: {
          icon: 'android-people',
          title: '管理者'
        },
        component: () => import('@/view/admin/admin.vue')
      },
      {
        path: 'admin_add',
        name: 'admin_add',
        meta: {
          icon: 'android-person-add',
          title: '添加管理者'
        },
        component: () => import('@/view/admin/add-admin.vue')
      },
      {
        path: 'admin_explain',
        name: 'admin_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/admin/file-explain.vue')
      }
    ]
  },
  {
    path: '/nav',
    name: 'nav',
    meta: {
      icon: 'ios-paperplane',
      title: 'Wyoungon导航图'
    },
    component: Main,
    children: [
      {
        path: 'Wyoungon_nav',
        name: 'Wyoungon_nav',
        meta: {
          icon: 'ios-navigate-outline',
          title: '导航图'
        },
        component: () => import('@/view/nav-mod/nav.vue')
      },
      {
        path: 'Wyoungon_nav_add',
        name: 'Wyoungon_nav_add',
        meta: {
          // access: ['super_admin'],
          icon: 'android-add',
          title: '初始化导航bannner'
        },
        component: () => import('@/view/nav-mod/init-nav.vue')
      },
      {
        path: 'Wyoungon_nav_explain',
        name: 'Wyoungon_nav_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/nav-mod/file-explain.vue')
      }
    ]
  },
  // user
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'person-stalker',
      title: '站员和用户管理'
    },
    component: Main,
    children: [
      {
        path: 'users',
        name: 'users',
        meta: {
          icon: 'record',
          title: '用户'
        },
        component: () => import('@/view/user/user.vue')
      },
      {
        path: 'youngon_user',
        name: 'youngon_user',
        meta: {
          // access: ['super_admin'],
          icon: 'happy',
          title: 'youngon站员'
        },
        component: () => import('@/view/user/youngonuser.vue')
      },
      {
        path: 'user_explain',
        name: 'user_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/user/file-explain.vue')
      }
    ]
  },

  // trend
  {
    path: '/trend',
    name: 'trend',
    meta: {
      icon: 'ios-pulse',
      title: '网站动态'
    },
    component: Main,
    children: [
      {
        path: 'trends',
        name: 'trends',
        meta: {
          icon: 'drag',
          title: '动态列表'
        },
        component: () => import('@/view/trend/trends.vue')
      },
      {
        path: 'add_trends',
        name: 'add_trends',
        meta: {
          // access: ['super_admin'],
          icon: 'android-add',
          title: '添加动态'
        },
        component: () => import('@/view/trend/add-trend.vue')
      },
      {
        path: 'trend_explain',
        name: 'trend_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/trend/file-explain.vue')
      }
    ]
  },

  // notice
  {
    path: '/notice',
    name: 'notice',
    meta: {
      icon: 'chatbubble',
      title: '通知公告'
    },
    component: Main,
    children: [
      {
        path: 'notices',
        name: 'notices',
        meta: {
          icon: 'ios-drag',
          title: '通知公告列表'
        },
        component: () => import('@/view/notice/notices.vue')
      },
      {
        path: 'add_notices',
        name: 'add_notices',
        meta: {
          // access: ['super_admin'],
          icon: 'ios-plus-outline',
          title: '添加通知公告'
        },
        component: () => import('@/view/notice/add-notice.vue')
      },
      {
        path: 'notice_explain',
        name: 'notice_explain',
        meta: {
          icon: 'ios-paper',
          title: '文档说明'
        },
        component: () => import('@/view/notice/file-explain.vue')
      }
    ]
  },

  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/error-page/404.vue')
  }
]
