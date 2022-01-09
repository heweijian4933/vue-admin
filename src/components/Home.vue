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
        default-active="1"
        background-color="#001529"
        text-color="#fff"
        router
        :collapse="isCollapse"
        class="nav-menu"
      >
        <el-submenu index="1">
          <template #title
            ><i class="el-icon-setting"></i><span>系统管理</span></template
          >
          <el-menu-item index="1-1"><span>用户管理</span></el-menu-item>
          <el-menu-item index="1-2"><span>菜单管理</span></el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template #title>
            <i class="el-icon-setting"></i><span>审批管理</span></template
          >
          <el-menu-item index="2-1"><span>休假申请</span></el-menu-item>
          <el-menu-item index="2-2"><span>待我审批</span></el-menu-item>
        </el-submenu>
      </el-menu>
      <!-- /导航菜单 -->
    </div>
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-folder" @click="toggle">
            <i class="el-icon-s-fold"></i>
          </div>
          <div class="breadcrump">面包屑</div>
        </div>

        <div class="userinfo">
          <!-- 消息提示 -->
          <el-badge is-dot class="notice" type="danger"
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
export default {
  name: "Home",
  data() {
    return {
      isCollapse: true,
      userInfo: {
        userName: "李栓蛋",
        userEmail: "lisuandan@163.com",
      },
    };
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse;
      console.log(this.isCollapse);
    },
    handleLogout(key) {
      if (key == "logout") {
        this.$store.commit("clearUserInfo");
        this.$router.push("/login");
      }
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
    &.fold{
      margin-left: 64px;
    }
    &.unfold{
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
        background-color: #fff;
        height: 100%;
      }
    }
  }
}
</style>
