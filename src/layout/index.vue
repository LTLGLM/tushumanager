<template>
  <div style="height: 100%">
    <!-- 主体部分 -->
    <el-container style="height: 100%">
      <!-- 侧边栏部分 -->
      <el-aside width="220px">
        <!-- logo区域 -->
        <div class="logotitle">
          <Logo :height="45" :width="45"></Logo>
          <span>校园二手平台交易系统</span>
        </div>
        <el-menu
          :router="true"
          background-color="#1F2D3D"
          active-text-color="#409EFF"
          @select="handleSelect"
          default-active
        >
          <Menu :routerList="sidebarRouters"></Menu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体部分 -->
      <el-container>
        <el-header>
          <Tabbar></Tabbar>
        </el-header>
        <el-main class="main">
          <Transition name="fade">
            <RouterView></RouterView>
          </Transition>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      defaultActivePath: "",
    };
  },
  computed: {
    ...mapGetters(["sidebarRouters"]),
  },
  created() {},
  methods: {
    handleSelect(index, indexPath) {
      
    },
  },
};
</script>

<style lang="scss" scoped>
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.el-header {
  background-color: #fff;
  border-bottom: 1px solid #ccc;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #fff;
  background-color: #304156;
  .logotitle {
    display: flex;
    margin: 7px 10px;
    font-size: 14px;
    justify-content: space-around;
    align-items: center;
  }
}
.main {
  background-color: #f0f2f5;
  // padding: 10px 10px;
}
.el-menu{
  // 解决el-menu展开之后少1px
  border: none;
}
.fade-enter {
  opacity: 0;
  transform: translateX(-$base-sidebar-width);
}
.fade-enter-to {
  opacity: 1;
}
.fade-enter-active {
  transition: all 0.5s ease;
}
</style>
