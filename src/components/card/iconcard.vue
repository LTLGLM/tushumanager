<template>
  <div>
    <el-card shadow="hover">
      <div class="context">
        <div class="iconStyle">
          <i class="el-icon-user-solid"></i>
        </div>
        <p>用户管理</p>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.context {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .iconStyle {
    height: 40px;
    width: 40px;
    background-color: #f6f6f6;
    border-radius: 200%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;
    i {
      color: #0256ff;
      font-size: 20px;
    }
  }
  p {
    font-size: 14px;
  }
}
</style>
