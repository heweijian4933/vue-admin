<template>
  <template v-for="(menu, index) in userMenu">
    <el-submenu
      index="1"
      v-if="
        menu.children &&
        menu.children.length > 0 &&
        menu.children[0].menuType == 1
      "
      :key="menu._id"
    >
      <template #title
        ><i :class="menu.icon"></i><span>{{ menu.menuName }}</span></template
      >
      <tree-menu :userMenu="menu.children" />
    </el-submenu>
    <el-menu-item
      v-else-if="menu.menuType == 1"
      :index="menu.path"
      :key="menu._id"
      ><span>{{ menu.menuName }}</span>
    </el-menu-item>
  </template>
</template>
<script>
export default {
  name: "TreeMenu",
  props: {
    userMenu: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>
<style lang="scss"></style>
