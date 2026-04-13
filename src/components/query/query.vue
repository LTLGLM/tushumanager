<template>
  <div>
    <el-form ref="queryFormRef" :model="queryForm">
      <slot></slot>
      <el-form-item>
        <el-button
          size="mini"
          icon="el-icon-search"
          type="primary"
          @click="handleSearch"
          >查询</el-button
        >
        <el-button size="mini" icon="el-icon-refresh" @click="handleRefresh"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    queryForm: {
      type: Object,
      required: true,
    },
    onSearch: {
      type: Function,
    },
    onRefresh: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleSearch() {
      this.$emit("onSearch");
    },
    handleRefresh() {
      // 重置表单
      this.$refs.queryFormRef.resetFields(); 
      this.$emit("onRefresh");
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    display: flex;
    margin-right: 20px;
    &:last-child {
      margin-right: 0;
    }
  }
}
// 媒体查询以适应小屏幕
@media (max-width: 768px) {
  .el-form {
    flex-direction: column; // 切换为纵向排列
    margin-right: 0; // 移除右侧外边距
  }
}
</style>
