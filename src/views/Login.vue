<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form ref="userForm" :model="userForm" status-icon :rules="rules">
        <div class="title">后台系统</div>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="userForm.username"
            prefix-icon="el-icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userForm.password"
            prefix-icon="el-icon-view"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" class="btn-login">
            登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      userForm: {
        username: "",
        password: "",
      },
      rules: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    login() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          console.log("校验合格");
          this.$api.login(this.userForm).then((res) => {
            console.log(res);
            this.$store.commit("saveUserInfo", res);
            this.$router.push("/welcome");
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style lang="scss">
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  width: 100vw;
  height: 100vh;

  .modal {
    width: 500px;
    height: 360px;
    box-shadow: 0 0 10px 3px #c7c7c7;

    box-sizing: border-box;
    padding: 50px;
    border-radius: 10px;
    .title {
      font-size: 50px;
      line-height: 1.5;
      text-align: center;
      margin-bottom: 30px;
    }
    .btn-login {
      width: 100%;
    }
  }
}
</style>
