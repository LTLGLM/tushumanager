export const constantRoute = [
    {
        path: '/login',
        name: "Login",
        component: () => import('@/views/login/login.vue'),
        meta: {
            hidden: true
        }
    }, {
        path: '/',
        name: 'Layout',
        component: () => import('@/layout/index.vue'),
        meta: {
            hidden: true
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                name: 'Home',
                component: () => import('@/views/home/home.vue'),
                meta: {
                    title: '首页',
                    icon: 'el-icon-s-home',
                    hidden: false,
                },
            },
        ]
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/404/404.vue'),
        meta: {
            hidden: true,
        },
    },
    {
        path: '*',
        name: 'Any',
        redirect: '/404',
        meta: {
            hidden: true,
        },
    },
]


// export const asycnRoute = [
//     {
//         path: '/usermanager',
//         name: 'UserManager',
//         component: () => import('@/layout/index.vue'),
//         meta: {
//             title: '用户管理',
//             icon: 'el-icon-user-solid',
//             hidden: false,
//         },
//         children: [
//             {
//                 path: "/usermanager/vipuser",
//                 name: "VipUser",
//                 component: () => import('@/views/user/vipuser.vue'),
//                 meta: {
//                     title: "会员管理",
//                     icon: "el-icon-star-on",
//                     hidden: false,
//                 }
//             },
//             {
//                 path: "/usermanager/address",
//                 name: "Address",
//                 component: () => import('@/views/user/address.vue'),
//                 meta: {
//                     title: "收货地址",
//                     icon: "el-icon-location-outline",
//                     hidden: false,
//                 }
//             },
//             {
//                 path: "/usermanager/collect",
//                 name: "Collect",
//                 component: () => import('@/views/user/collect.vue'),
//                 meta: {
//                     title: "会员收藏",
//                     icon: "el-icon-star-off",
//                     hidden: false,
//                 }
//             },
//             {
//                 path: "/usermanager/footmark",
//                 name: "Footmark",
//                 component: () => import('@/views/user/footmark.vue'),
//                 meta: {
//                     title: "会员足迹",
//                     icon: "el-icon-location-pin",
//                     hidden: false,
//                 }
//             },
//             {
//                 path: "/usermanager/queryhistory",
//                 name: "QueryHistory",
//                 component: () => import('@/views/user/queryhistory.vue'),
//                 meta: {
//                     title: "搜索历史",
//                     icon: "el-icon-search",
//                     hidden: false,
//                 }
//             }
//         ]
//     },
//     {
//         path:"/systemmanager",
//         name: "SystemManager",
//         component: () => import('@/layout/index.vue'),
//         meta: {
//             title: '系统管理',
//             icon: 'el-icon-setting',
//             hidden: false,
//         },
//         children:[
//             {
//                 path:"/systemmanager/admin",
//                 name: "Admin",
//                 component: () => import('@/views/system/admin.vue'),
//                 meta: {
//                     title: "管理员",
//                     icon: "el-icon-user-solid",
//                     hidden: false,
//                 }
//             },
//             {
//                 path:"/systemmanager/role",
//                 name: "Role",
//                 component: () => import('@/views/system/role.vue'),
//                 meta: {
//                     title: "角色",
//                     icon: "el-icon-lock",
//                     hidden: false,
//                 }
//             },
//             {
//                 path:"/systemmanager/notification",
//                 name: "Notification",
//                 component: () => import('@/views/system/notification.vue'),
//                 meta: {
//                     title: "通知管理",
//                     icon: "el-icon-message",
//                     hidden: false,
//                 }
//             },
//             {
//                 path:"/systemmanager/log",
//                 name: "Log",
//                 component: () => import('@/views/system/log.vue'),
//                 meta: {
//                     title: "操作日志",
//                     icon: "el-icon-time",
//                     hidden: false,
//                 }
//             }
//         ]
//     },
//     {
//         path:"/setmanager",
//         name: "SetManager",
//         component: () => import('@/layout/index.vue'),
//         meta: {
//             title: '设置管理',
//             icon: 'el-icon-setting',
//             hidden: false,
//         },
//         children:[
//             {
//                 path:"/setmanager/freightset",
//                 name: "FreightSet",
//                 component: () => import('@/views/set/freightset.vue'),
//                 meta: {
//                     title: "运费配置",
//                     icon: "el-icon-postcard",
//                     hidden: false,
//                 }
//             },
//             {
//                 path:"/setmanager/orderset",
//                 name: "OrderSet",
//                 component: () => import('@/views/set/orderset.vue'),
//                 meta: {
//                     title: "订单配置",
//                     icon: "el-icon-s-order",
//                     hidden: false,
//                 }
//             },
//             {
//                 path:"/setmanager/otherset",
//                 name: "OtherSet",
//                 component: () => import('@/views/set/otherset.vue'),
//                 meta: {
//                     title: "其他设置",
//                     icon: "el-icon-setting",
//                     hidden: false,
//                 }
//             }
//         ]
//     }
// ]