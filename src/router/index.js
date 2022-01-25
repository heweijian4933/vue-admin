import { createRouter, createWebHashHistory } from 'vue-router'

import store from '@/store'
import storage from '@/utils/storage.js'
import Home from '@/components/Home.vue'
import API from './../api'
import util from './../utils/util.js'

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
    {
        name: '404',
        path: '/404',
        meta: {
            title: "404页面不存在"
        },
        component: () => import('@/views/404.vue')
    },

]

const router = createRouter({
    routes,
    history: createWebHashHistory()
})
//获取同步路由routes
async function loadAsyncRoutes() {
    const { userInfo, token } = store.state
    if (token) {
        try {
            const { menuList, actionList } = await API.getMenuList()
            store.commit("saveUserMenus", menuList);
            store.commit("saveUserActions", actionList);
            let routes = util.generateRoutes(menuList)
            routes.forEach(route => {
                let url = `./../views/${route.component}.vue`.replace('//', '/')
                route.component = () => import(/* @vite-ignore */url) //只能用./或者../开头不能用@, 且结尾一定要带.vue
                // 详情见https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#limitations
                router.addRoute("home", route)
            })
            // console.log("router.getRoutes()", router.getRoutes());
        } catch (error) {

        }

    }

}
await loadAsyncRoutes(); // 必须要同步, 否则router加载页面的时候可能页面参数还没有返回就会报错

//导航守卫
router.beforeEach((to, from, next) => {
    if (router.hasRoute(to.name)) {
        document.title = to.meta.title
        next()
    } else {
        next('/404')
        // next()
    }
})

export default router