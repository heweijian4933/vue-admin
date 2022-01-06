/**
 * 环境配置封装
 */

const env = import.meta.env.MODE || 'prod';

const EnvConfig = {
    dev: {
        baseApi: '/api',
        mockApi: 'https://www.fastmock.site/mock/7a0b6683dabd27e51c01e8c4797bf763/api'
    },
    prod: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/7a0b6683dabd27e51c01e8c4797bf763/api'
    },
    test: {
        baseApi: '/',
        mockApi: 'https://www.fastmock.site/mock/7a0b6683dabd27e51c01e8c4797bf763/api'
    },
}

export default {
    env,
    mock: true,
    nameSpace: "vueAdminSpace",
    ...EnvConfig[env]
}