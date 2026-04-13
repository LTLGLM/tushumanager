<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { MessageBox } from "element-ui";
import { mapActions, mapGetters } from "vuex";

export default {
  created() {
    if (!this.websocketClient) {
      this.initWebSocketClient("websocket");
    }
    this.listenRolePermissionChange();
    
  },
  computed: {
    ...mapGetters(["websocketClient"]),
  },
  methods: {
    ...mapActions(["initWebSocketClient"]),
    // 监听角色权限修改事件
    listenRolePermissionChange() {
      this.websocketClient.on("menuNoticeMessage", (data) => {
        MessageBox.confirm(data.message, {
          confirmButtonText: "刷新页面",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((result) => {
            if (result) {
              window.location.reload();
            }
          })
          .catch((err) => {});
      });
    },
  },
};
</script>

<style scoped lang="scss">
#app {
  height: 100vh;
  width: 100vw;
}
</style>
<style lang="scss">
.el-card {
  .el-form-item {
    display: flex;
    margin-right: 20px;
  }
}
.el-dialog {
  min-width: 600px;
  .el-form {
    .el-form-item {
      .el-input {
        width: 50%;
      }
    }
  }
}
</style>
