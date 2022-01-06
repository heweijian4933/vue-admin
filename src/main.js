import { createApp } from 'vue'
import App from './App.vue'


import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import router from '@/router'
import request from '@/api/request.js'
import storage from '@/utils/storage.js'

console.log("环境变量=>", import.meta.env);

const app = createApp(App)

// 全局挂载请求封装
app.config.globalProperties.$request = request
app.config.globalProperties.$storage = storage

app.use(ElementPlus)
app.use(router).mount('#app')
