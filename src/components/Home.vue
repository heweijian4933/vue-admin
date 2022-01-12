<template>
  <div class="basic-layout">
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="" />
        <span :class="['logo-title', isCollapse ? 'fold' : 'unfold']"
          >Admin</span
        >
      </div>
      <!-- 导航菜单 -->
      <el-menu
        :default-active="activeMenu"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <!-- 导航菜单封装 -->
        <tree-menu :userMenu="userMenu"></tree-menu>
        <!-- /导航菜单封装 -->
      </el-menu>
      <!-- /导航菜单 -->
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-folder" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="breadcrumb">
            <bread-crumb></bread-crumb>
          </div>
        </div>

        <div class="userinfo">
          <!-- 消息提示 -->
          <el-badge
            :is-dot="noticeCount ? true : false"
            class="notice"
            type="danger"
            ><i class="el-icon-bell"></i
          ></el-badge>
          <!-- /消息提示 -->
          <!-- 用户信息下拉框 -->
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <i class="el-icon--right"> </i>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email"
                  >邮箱: {{ userInfo.userEmail }}</el-dropdown-item
                >
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <!-- /用户信息下拉框 -->
        </div>
      </div>
      <div class="wrapper">
        <div class="content-main">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import treeMenu from "./TreeMenu.vue";
import breadCrumb from "./BreadCrumb.vue";
export default {
  name: "Home",
  components: {
    treeMenu,
    breadCrumb,
  },
  data() {
    return {
      isCollapse: false,
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      activeMenu: window.location.hash.slice(1),
    };
  },
  mounted() {
    this.getNoticeCount();
    this.getMenuList();
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
      // console.log(this.isCollapse);
    },
    handleLogout(key) {
      if (key == "logout") {
        this.$store.commit("clearUserInfo");
        this.$router.push("/login");
      }
    },
    async getNoticeCount() {
      // Todo 权限: 根据params用户信息来返回通知
      const { count } = await this.$api.noticeCount();
      this.noticeCount = count || this.noticeCount;
    },
    async getMenuList() {
      // Todo 权限: 根据params用户信息来返回
      const menuList = await this.$api.getMenuList();
      // console.log(menuList);
      this.userMenu = menuList;
    },
  },
};
</script>
<style lang="scss">
.basic-layout {
  position: relative;
  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff;
    overflow-y: auto;
    transition: 0.5s;

    .el-menu--collapse .el-submenu__title {
    }
    .el-menu--collapse .el-submenu__title span {
      height: 0;
      width: 0;
      overflow: hidden;
      visibility: hidden;
      display: inline-block;
    }
    .el-menu--collapse .el-submenu__icon-arrow {
      display: none;
    }

    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;
      img {
        margin: 0 16px;
        width: 32px;
        height: 32px;
      }
      .logo-title {
        &.fold {
          display: none;
        }
        &.unfold {
          display: inline;
        }
      }
    }
    .nav-menu {
      height: calc(100vh - 50px);
      border-right: none;
      overflow: hidden;
    }
    // 合并侧边栏
    &.fold {
      width: 64px;
    }
    // 展开侧边栏
    &.unfold {
      width: 200px;
    }
  }
  .content-right {
    margin-left: 200px;
    // 配合.nav-side做toggle菜单栏时的动画过渡
    transition: 0.5s;

    &.fold {
      margin-left: 64px;
    }
    &.unfold {
      margin-left: 200px;
    }
    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;
        .menu-folder {
          // padding-left: 16px;
          margin-right: 20px;
          font-size: 25px;
        }
      }

      .userinfo {
        .notice {
          line-height: 30px;
          margin-right: 10px;
        }
        .user-link {
          cursor: pointer;
          color: #409eff;
        }
      }
    }
    .wrapper {
      background-color: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px);
      .content-main {
        // background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
