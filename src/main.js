import { createApp } from 'vue'
import App from './App.vue'

import store from './store'

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css';


import router from '@/router'
import request from '@/api/request.js'
import api from '@/api/index.js'
import storage from '@/utils/storage.js'

console.log("环境变量=>", import.meta.env);

const app = createApp(App)

//自定义指令, 用于判断按钮权限
app.directive('has', {
    beforeMount: (el, binding) => {
        //获取按钮权限
        let actionList = storage.getItem('actionList')
        if (!actionList.includes(binding.value)) {
            //如果按钮权限列表当中没有该项
            el.style = "display:none"
            setTimeout(() => {
                el.parentNode.removeChild(el)
            }, 0)
        }
    },
})

// 全局挂载请求封装
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage
app.config.globalProperties.$api = api

app.use(ElementPlus, { size: "medium" })
app.use(store)
app.use(router).mount('#app')
