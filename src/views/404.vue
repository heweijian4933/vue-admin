<template>
  <div class="exception">
    <img src="@/assets/img/404.jpg" alt="" />
    <el-button @click="goHome" class="btn-home" size="large" type="primary"
      >回首页</el-button
    >
  </div>
</template>
<script>
export default {
  name: "404",
  methods: {
    goHome() {
      this.$router.push("/");
    },
  },
};
</script>
<style lang="scss">
.exception {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    // width: 100%;
    height: 100vh;
  }
  .btn-home {
    position: fixed;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
}
</style>
