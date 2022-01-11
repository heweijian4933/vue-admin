<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎</div>
      <div class="title">内部管理系统</div>
      <div class="desc">
        Vue3 + ElementPLus + Node + koa + MongoDB打造的后台通用管理系统
      </div>
    </div>
    <div class="img"></div>
    <!-- <div>欢迎来到 welcome 页面</div>
    <router-link to="/login">去登录页</router-link> -->
  </div>
</template>
<script>
export default {
  name: "Welcome",
};
</script>
<style lang="scss">
.welcome {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;

  .content {
    .sub-title {
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title {
      font-size: 50px;
      line-height: 62px;
      color: #409eff;
    }
    .desc {
      text-align: right;
      font-size: 24px;
      color: #999;
    }
  }
  .img {
    background-image: url("./../assets/img/welcome.png");
    width: 371px;
    height: 438px;
    margin-left: 105px;
  }
}
</style>
