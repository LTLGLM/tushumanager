<template>
  <div>
    <!-- 侧边栏导航 -->
    <template v-for="item in routerList">
      <template v-if="!item.component">
        <el-submenu :index="item.path">
          <template slot="title"
            ><i
              :class="item.meta.icon != '#' ? 'el-icon-' + item.meta.icon : ''"
            ></i
            >{{ item.meta.title }}</template
          >
          <template v-if="item.children">
            <Menu :routerList="item.children"></Menu>
          </template>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item :index="item.path"
          ><i
            :class="item.meta.icon != '#' ? 'el-icon-' + item.meta.icon : ''"
          ></i
          >{{ item.meta.title }}</el-menu-item
        >
      </template>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["routerList"],
  mounted() {},
};
</script>

<style lang="scss" scoped>
.el-submenu {
  ::v-deep .el-submenu__title {
    background-color: #304156 !important;
    color: #fff;
  }
  .el-menu-item {
    color: #fff;
  }
}
.logotitle {
  display: flex;
  margin: 7px 10px;
  font-size: 14px;
  justify-content: space-around;
  align-items: center;
}
</style>
