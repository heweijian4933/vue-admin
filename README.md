# vite+vue

2021/1/14

- 用户模块 日期格式化,实现模糊查询和分页逻辑联调;
- vuex 配置更改为严格模式

2021/1/13

- 修复全局 config 在 request.js 当中参数被覆盖 mock 接口和本地接口混用后因为 axios 实例共用的 bug

2021/1/12

- 用户模块 删除+批量删除, 编辑,新增,更新功能 实现

2021/1/11

- 用户模块页面搭建和业务逻辑实现

2021/1/10

- 增加消息通知提示接口和菜单模块(嵌套)封装
- 面包屑组件封装
- Login 页面登陆逻辑打通
- request.js 对返回的错误响应做了更加细致处理,改善用户体验

2021/1/9

- 欢迎页面 welcome.vue 布局及样式构建
- 修复 element-plus 侧边栏 collapse 时菜单文字溢出的 bug

2021/1/7

- 登录页面搭建
- vuex 引入
- vite 代理设置,login 接口初步调联完成

2021/1/6

- axios 二次封装 api/request.js
- localStorage 二次封装 utils/storage.js
- 完善 Element-Plus 引入
- 在 app.vue 中引入全局样式
- Home.vue 初始布局和 css 规划

2021/1/5

- 项目结构初始化，路由封装
- 引入 Element-Plus
- 配置环境变量并统一封装配置到 src/config
- 配置 fastMock 模拟接口
