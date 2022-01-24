import request from './request.js'
export default {
    // 菜单模块
    getMenuList(params) {
        return request({
            url: "menus/treeList",
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
            // mock: true,
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

    // 角色模块
    getRoleAllList(params) {
        return request({
            url: "roles/allList",
            method: "get",
            data: params,
            // mock: true,
        })
    },
    getRoleList(params) {
        return request({
            url: "roles/list",
            method: "get",
            data: params,
            // mock: true,
        })
    },
    roleCreate(params) {
        return request({
            url: "roles/create",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    roleUpdate(params) {
        return request({
            url: "roles/update",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    roleUpdatePermission(params) {
        return request({
            url: "roles/updatePermission",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    roleDel(params) {
        return request({
            url: "roles/delete",
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
    getUserList(params) {
        return request({
            url: "users/list",
            method: "get",
            data: params,
            // mock: true,
        })
    },
    getUserAllList(params) {
        return request({
            url: "users/allList",
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
            url: "users/update",
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

    // 部门模块
    getDeptTreeList(params) {
        return request({
            url: "depts/treeList",
            method: "get",
            data: params,
            // mock: true,
        })
    },
    deptCreate(params) {
        return request({
            url: "depts/create",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    deptUpdate(params) {
        return request({
            url: "depts/update",
            method: "post",
            data: params,
            // mock: true,
        })
    },
    deptDel(params) {
        return request({
            url: "depts/delete",
            method: "post",
            data: params,
            // mock: true,
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