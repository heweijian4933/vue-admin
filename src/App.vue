<template>
  <router-view></router-view>
</template>
<script>
export default {
  name: "app",
};
</script>

<style lang="scss">
@import "./assets/style/index.scss";
@import "./assets/style/reset.css";
div::-webkit-scrollbar {
  width: 0 !important;
}
</style>
