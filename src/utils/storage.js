/**
 * Storage二次封装
 * @author heweijian
 */
import config from '@/config'
export default {
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.nameSpace) || "{}")
    },
    setItem(key, val) {
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.nameSpace, JSON.stringify(storage))
    },
    getItem(key) {
        let storage = this.getStorage()
        return storage[key]
    },
    clearItem(key) {
        let storage = this.getStorage()
        delete storage[key]
        window.localStorage.setItem(config.nameSpace, JSON.stringify(storage))
    },
    clearAll() {
        window.localStorage.clear()
    }
}