<template>
  <div>欢迎来到 Login 页面</div>
  <!-- <el-button type="danger">按钮</el-button> -->
  <router-link to="/">回到首页</router-link>
</template>
<script>
export default {
  name: "Login",
  mounted() {
    this.$request({
      method: "get",
      url: "/login",
      data: {
        username: "stephen",
        password: "12345678",
      },
    }).then((res) => {
      console.log(res);

      // this.$storage.setItem("userInfo", { name: "李四", age: 23 });
      // let userInfo = this.$storage.getItem("userInfo");
      // console.log(userInfo);
      // this.$storage.clearAll();
    });
  },
};
</script>
<style lang="scss"></style>
