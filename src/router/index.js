import { createRouter, createWebHashHistory } from 'vue-router'

import Home from '@/components/Home.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        redirect: '/welcome',
        meta: {
            title: '首页'
        },
        children: [
            {
                path: '/welcome',
                name: 'welcome',
                meta: {
                    title: '欢迎页'
                },
                component: () => import('@/views/Welcome.vue'),
            },

            {
                path: '/system/user',
                name: 'user',
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/Welcome.vue'),
                children: [
                    {
                        path: 'add',
                        name: '新增',
                        meta: {
                            title: '用户新增'
                        },
                        component: () => import('@/views/Welcome.vue'),
                        children: [
                            {
                                path: 'add-sub',
                                name: '新增-sub',
                                meta: {
                                    title: '用户新增-sub'
                                },
                                component: () => import('@/views/Welcome.vue'),
                            },
                        ]
                    },
                ]
            },

        ]
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录页'
        },
        component: () => import('@/views/Login.vue'),
    },

]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})

export default router