import request from './request.js'
export default {
    // 菜单模块
    getMenuList(params) {
        return request({
            url: "menu/list",
            method: "get",
            data: params,
            mock: true,
        })
    },

    // 用户模块
    login(params) {
        return request({
            url: "users/login",
            method: "post",
            data: params,
            // mock: false,
        })
    },

    // 系统模块
    getUserList(params) {
        return request({
            url: "users/list",
            method: "get",
            data: params,
            mock: true,
        })
    },

    // 审批模块
    noticeCount(params) {
        return request({
            url: "leave/count",
            method: "get",
            data: params,
            mock: true,
        })
    }
}