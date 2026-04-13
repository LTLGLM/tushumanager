<template>
  <div class="header">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="header-left">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 右侧按钮和用户信息 -->
    <div class="header-right">
      <el-dropdown placement="bottom" @visible-change="visibleChange">
        <el-button
          icon="el-icon-chat-dot-round"
          class="header-button"
        ></el-button>
        <el-dropdown-menu slot="dropdown">
          <Message ref="messageRef" @checkNotice="checkNotice"></Message>
        </el-dropdown-menu>
      </el-dropdown>

      <!-- 用户下拉菜单 -->
      <el-dropdown :hide-timeout="200" @command="handleCommand">
        <span class="header-user">
          <i class="el-icon-user"></i>
          <span>{{ username }}</span>
          <i class="el-icon-arrow-down"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="退出登录">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
    <!-- 通知弹窗 -->
    <el-dialog
      title="通知"
      :visible.sync="noticeVisible"
      width="30%"
      class="noticeDialog"
    >
      <div>
        <span>标题</span>
        <span class="noticeTitle">{{ notice.noticeTitle }}</span>
      </div>
      <div class="noticeContent">
        <span>内容</span>
        <div v-html="notice.noticeContent"></div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noticeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleNoticeSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { updateAdminNoticeStatus } from "@/api/notice";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      noticeVisible: false,
      notice: {},
    };
  },
  computed: {
    ...mapGetters(["username","websocketClient"]),
  },
  methods: {
    ...mapMutations(["SET_WEBSOCKET_CLIENT"]),
    ...mapActions(["Logout"]),
    handleCommand(command) {
      if (command === "退出登录") {
        this.logout();
      } else {
        this.$router.push("/people");
      }
    },
    logout() {
      this.Logout()
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: res.message,
              type: "success",
            });
            // 断开websocket连接
            this.websocketClient.disconnect()
            this.SET_WEBSOCKET_CLIENT(null)
            this.$router.push("/login"); // 跳转到登录页
          }
        })
        .catch((err) => {
          this.$message({
            message: "退出登录失败",
            type: "error",
          });
        });
    },
    checkNotice(notice) {
      this.notice = notice;
      this.noticeVisible = true;
    },
    handleNoticeSubmit() {
      updateAdminNoticeStatus(this.notice)
        .then((res) => {
          this.noticeVisible = false;
        })
        .catch((err) => {});
    },
    // 通知下拉框出现
    visibleChange(flag) {
      if(flag){
        this.$refs.messageRef.getNoticeByAdmin()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .header-right {
    display: flex;
    align-items: center;
    .el-button {
      width: 20px;
      height: 60px;
      border: 0px;
      background-color: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }
    .el-button:hover {
      background-color: #ccc;
    }
    .header-user {
      > * {
        padding: 0 5px;
      }
    }
  }
}
.noticeDialog {
  .el-dialog__body {
    div {
      font-size: 14px;
      .noticeTitle {
        font-size: 16px;
        margin-left: 30px;
      }
    }
    .noticeContent {
      display: flex;
      line-height: 0.5;
      // width: 300px;
      word-wrap: break-word;
      line-height: 1.2;
      span {
        white-space: nowrap; /* 文本不换行 */
      }
      div {
        margin-left: 30px;
      }
    }
  }
}
</style>
