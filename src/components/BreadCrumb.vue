<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumbList"
        :key="item.path"
      >
        <router-link :to="breadCrumbList[index].path">{{
          item.meta.title
        }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
export default {
  name: "BreadCrumb",
  data() {
    return {};
  },
  computed: {
    breadCrumbList() {
      // console.log(this.$route.matched);
      return this.$route.matched;
    },
  },
};
</script>
<style lang="scss"></style>
