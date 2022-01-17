import request from './request.js'
export default {
    // 菜单模块
    getMenuList(params) {
        return request({
            url: "menus/list",
            method: "get",
            data: params,
            // mock: true,
        })
    },
    menuCreate(params) {
        return request({
            url: "menus/create",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    menuDel(params) {
        return request({
            url: "menus/delete",
            method: "post",
            data: params,
            mock: true,
        })
    },
    menuUpdate(params) {
        return request({
            url: "menus/update",
            method: "post",
            data: params,
            // mock: true,
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
            // mock: true,
        })
    },
    userCreate(params) {
        return request({
            url: "users/create",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    userUpdate(params) {
        return request({
            url: "users/Update",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    userDel(params) {
        return request({
            url: "users/delete",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    getRoleAllList(params) {
        return request({
            url: "roles/allList",
            method: "get",
            data: params,
            mock: true,
        })
    },
    getDeptAllList(params) {
        return request({
            url: "dept/allList",
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