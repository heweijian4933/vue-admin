/**
 * vuex 状态管理
 */
import { createStore } from 'vuex';
import mutations from './mutations.js';
import storage from '@/utils/storage.js';
import config from '@/config'

const state = {
    userInfo: storage.getItem("userInfo") || {}, //获取用户信息
}

export default createStore({
    state,
    mutations,
    strict: (config.env !== 'production') && (config.env !== 'prod')
})

/*
strict 配置
在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
不要在发布环境下启用严格模式！严格模式会深度监测状态树来检测不合规的状态变更——请确保在发布环境下关闭严格模式，以避免性能损失。
详情查看 https://next.vuex.vuejs.org/guide/strict.html
 */