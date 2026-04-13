<template>
  <div class="message">
    <div class="message-header">
      <span>系统通知</span>
      <span class="message-allclear" @click="allConfirm">全部已读</span>
    </div>
    <hr />
    <div class="message-body">
      <div v-if="notifications.length">
        <div
          class="noticeItem"
          v-for="item in notifications"
          :key="item.id"
          @click="handleNotificationClick(item)"
        >
          <svg
            v-if="!item.noticeStatus"
            t="1738929505811"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3345"
            width="20"
            height="20"
          >
            <path
              d="M245.76 286.72h552.96c124.928 0 225.28 100.352 225.28 225.28s-100.352 225.28-225.28 225.28H0V532.48c0-135.168 110.592-245.76 245.76-245.76z m133.12 348.16V401.408H348.16v178.176l-112.64-178.176H204.8V634.88h30.72v-178.176L348.16 634.88h30.72z m182.272-108.544v-24.576h-96.256v-75.776h110.592v-24.576h-141.312V634.88h143.36v-24.576h-112.64v-83.968h96.256z m100.352 28.672l-34.816-151.552h-34.816l55.296 233.472H675.84l47.104-161.792 4.096-20.48 4.096 20.48 47.104 161.792h28.672l57.344-233.472h-34.816l-32.768 151.552-4.096 30.72-6.144-30.72-40.96-151.552h-30.72l-40.96 151.552-6.144 30.72-6.144-30.72z"
              fill="#EE502F"
              p-id="3346"
            ></path>
          </svg>
          <span v-html="item.noticeContent"></span>
          <span>{{ item.createTime }}</span>
        </div>
      </div>
      <div v-else>
        <i style="font-size: 100px" class="el-icon-chat-dot-round"></i>
        <div>暂无通知</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getNoticeByAdmin, updateAllNoticeStatus } from "@/api/notice";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      notifications: [],
    };
  },
  created() {
    // this.getNoticeByAdmin();
    this.listenNoticeChange();
  },
  computed: {
    ...mapGetters(["userId", "websocketClient"]),
  },
  methods: {
    getNoticeByAdmin() {
      // 获取后台数据，并将数据添加到 notifications中
      getNoticeByAdmin(this.userId)
        .then((res) => {
          if (res.data) {
            this.notifications = res.data;
          } else {
            this.notifications = [];
          }
        })
        .catch((err) => {
          this.$message.error("获取通知数据失败");
        });
    },
    listenNoticeChange() {
      this.websocketClient.on("noticeMessage", (data) => {
        this.notifications.shift(data);
        this.$notification({
          title: "你有一条新通知",
          message: data.noticeContent,
          type: "warning",
        });
      });
    },
    handleNotificationClick(notice) {
      this.$emit("checkNotice", notice);
    },
    allConfirm() {
      if (this.notifications.length > 0) {
        updateAllNoticeStatus()
          .then((res) => {
            if (res.code === 200) {
              this.getNoticeByAdmin();
            }
          })
          .catch();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  width: 300px;
  font-size: 14px;
  .message-header {
    display: flex;
    justify-content: space-between;
    padding: 10px 15px;
    .message-allclear {
      color: #3491fa;
      &:hover {
        cursor: pointer;
      }
    }
  }
  .message-body {
    // opacity: 0.2;
    text-align: center;
    div {
      font-size: 14px;
      .noticeItem {
        display: flex;
        margin: 5px 15px;
        justify-content: space-between;
        align-items: center;
        // border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        border-radius: 10px;
        padding: 10px 5px;
        span {
          font-size: 12px;
        }

        &:hover {
          background-color: #f5f5f5;
        }
      }
    }
  }
}
</style>
