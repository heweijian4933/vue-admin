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
                name: 'user',
                path: '/system/user',
                meta: {
                    title: '用户管理'
                },
                component: () => import('@/views/User.vue'),
            },
            {
                name: 'menu',
                path: '/system/menu',
                meta: {
                    title: '菜单管理'
                },
                component: () => import('@/views/Menu.vue'),
            },
            {
                name: 'role',
                path: '/system/role',
                meta: {
                    title: '角色管理'
                },
                component: () => import('@/views/Role.vue'),
            },
            {
                name: '部门管理',
                path: '/system/dept',
                meta: {
                    title: "部门管理"
                },
                component: () => import('@/views/Dept.vue')
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