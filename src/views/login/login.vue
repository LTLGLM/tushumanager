<template>
  <div class="login_page_bg">
    <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
      <h2>校园二手平台交易系统</h2>
      <el-form-item prop="username">
        <el-input
          class="login_Input"
          prefix-icon="el-icon-user-solid"
          v-model="loginForm.username"
          placeholder="请输入你的用户名"
        ></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          class="login_Input"
          prefix-icon="el-icon-lock"
          v-model="loginForm.password"
          placeholder="请输入你的密码"
          :show-password="true"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code" class="codeStyle">
        <el-input
          type="text"
          class="login_Input"
          prefix-icon="el-icon-message"
          v-model="loginForm.code"
          placeholder="请输入验证码"
        ></el-input>
        <img :src="imaCode" alt="" @click="getImgCode" />
      </el-form-item>
      <el-button
        class="loginbtn"
        type="primary"
        @click="submitLogin"
        :disabled="loginbtn"
        >登录</el-button
      >
    </el-form>
  </div>
</template>

<script>
import { getImgCode } from "@/api/login";
import { mapActions } from "vuex";
export default {
  data() {
    return {
      // 登录防抖
      loginbtn: false,
      loginForm: {
        username: "admin",
        password: "123456",
        code: "",
        uuid: "",
      },
      imaCode: "",
      loginRules: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "用户名长度在 5 到 12 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 12,
            message: "密码长度在 6 到 12 个字符",
            trigger: "blur",
          },
        ],
        code: [{ required: true, message: "验证码不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    // 判断验证码图片是否显示
    this.checkImgCode();
  },
  mounted() {},
  computed: {},
  methods: {
    // 加载userstore里的方法
    ...mapActions(["Login"]),
    // 获取验证码图片
    getImgCode() {
      getImgCode()
        .then((res) => {
          if (res.code == 200) {
            this.imaCode = "data:image/gif;base64," + res.image;
            this.loginForm.uuid = res.uuid;
          } else {
            this.$message({
              message: "获取验证码图片失败",
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    checkImgCode() {
      this.getImgCode();

      setTimeout(() => {
        if (!this.imaCode) {
          console.log("验证码未加载成功，3秒后重新获取");
          this.checkImgCode();
        }
      }, 3000);
    },
    submitLogin() {
      // 验证表单
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          // 验证通过，提交登录
          this.loginbtn = true;
          this.Login(this.loginForm)
            .then((res) => {
              if (res.code == 200) {
                this.$message({
                  message: "登录成功",
                  type: "success",
                });
                this.$router.push({ path: "/home" });
              }
            })
            .catch((error) => {
              this.getImgCode();
            })
            .finally(() => {
              this.loginbtn = false;
            });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.login_page_bg {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url(@/assets/images/login_bg.png);
  .el-form {
    h2 {
      font-size: 25px;
      letter-spacing: 10px;
      text-align: center;
      margin-bottom: 20px;
      color: #fff;
    }
    width: 400px;
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    border: 1px solid #919191;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    // 模糊处理
    backdrop-filter: blur(5px);
    .el-form-item {
      width: 90%;
      .el-form-item__content {
        margin-bottom: 15px;
        display: flex;
        justify-content: center;
        align-items: center;
        .el-input {
          width: 100%;
          position: relative;
          ::v-deep .el-input__inner {
            border: 0;
            height: 35px;
            border-radius: 5px;
            background: transparent;
            color: #fff;
            &:focus {
              outline: none;
            }
          }
          // &:nth-last-child(2) {
          //   width: auto;
          // }
          &::after {
            position: absolute;
            content: "";
            height: 2px;
            bottom: 0;
            left: 0;
            width: 100%;
            background-image: linear-gradient(
              to left,
              #74ebd5 0%,
              #9face6 100%
            );
          }
        }
      }
    }
    .codeStyle {
      ::v-deep .el-form-item__content {
        display: flex;
        align-items: center; // 垂直居中对齐
        justify-content: center; // 水平居中对齐
        flex-direction: row;
        .el-input {
          flex: 2;
          margin-right: 10px;
        }
        img {
          flex: 1;
        }
      }
    }
    .loginbtn {
      width: 90%;
      margin: 10px 0;
      border-radius: 5px;
    }
  }
}
</style>
