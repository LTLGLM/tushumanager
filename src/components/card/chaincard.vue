<template>
  <div>
    <el-card shadow="hover">
      <div class="card-header">
        <span>销售额</span>
        <el-tag effect="plain">今日</el-tag>
      </div>
      <div class="card-center">
        <div class="showValue">123</div>
        <div class="lastdayValue">
          <span class="yesteday">昨日 669</span>
          <span>日环比 -99.7%</span>
          <i
            class="el-icon-caret-bottom"
            :style="{ color: showColor ? '#0FC6C2' : '#0FC6C2' }"
          ></i>
        </div>
      </div>
      <div class="card-footer">
        <span>本日销售额</span>
        <span>80464.98元</span>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data(){
    return{
      showColor:false
    }
  }
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin-top: -10px;
}
.card-center {
  padding: 20px 0;
  border-bottom: 1px solid #eef4ff;
  .showValue {
    font-size: 30px;
    margin-bottom: 10px;
  }
  .lastdayValue {
    font-size: 14px;
    .yesteday {
      margin-right: 15px;
    }
  }
}
.card-footer {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #999999;
  margin-top: 12px;
}
</style>
