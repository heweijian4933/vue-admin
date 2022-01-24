/**
 * mutations 业务层数据
 */
import storage from '@/utils/storage.js'

//如果后续业务扩大, 可以根据模块对mutations进行拆分, 以方便维护
export default {
    saveUserInfo(state, userInfo) {
        state.userInfo = userInfo
        storage.setItem("userInfo", userInfo)
    },
    saveToken(state, token) {
        state.token = token
        storage.setItem("token", token)
    },

    clearUserInfo(state) {
        state.userInfo = {}
        storage.clearItem("userInfo")
    },

    saveUserMenus(state, menuList) {
        state.menuList = menuList
        storage.setItem("menuList", menuList)
    },
    saveUserActions(state, actionList) {
        state.actionList = actionList
        storage.setItem("actionList", actionList)
    },
}