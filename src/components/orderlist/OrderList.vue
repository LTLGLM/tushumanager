<template>
  <el-table
    :data="list"
    style="width: 100%"
    @selection-change="handleSelectionChange"
  >
    <!-- 多选框 -->
    <el-table-column
      type="selection"
      width="55"
    />
    
    <!-- 订单号 -->
    <el-table-column
      prop="orderId"
      label="订单号"
      width="180"
    />
    
    <!-- 商品信息 -->
    <el-table-column
      label="商品信息"
    >
      <template slot-scope="scope">
        <div style="display: flex; align-items: center;">
          <img 
            :src="scope.row.goodInfo.goodImage.startsWith('/') ? `/dev-api${scope.row.goodInfo.goodImage}` : scope.row.goodInfo.goodImage" 
            style="width: 50px; height: 50px; margin-right: 10px;"
          />
          <div>
            <div>{{ scope.row.goodInfo.goodName }}</div>
            <div style="color: #999;">数量：{{ scope.row.goodInfo.quantity }}</div>
          </div>
        </div>
      </template>
    </el-table-column>
    
    <!-- 买家信息 -->
    <el-table-column
      label="买家信息"
      width="150"
    >
      <template slot-scope="scope">
        <div>{{ scope.row.buyerInfo.username }}</div>
        <div style="color: #999;">{{ scope.row.buyerInfo.phone }}</div>
      </template>
    </el-table-column>
    
    <!-- 卖家信息 -->
    <el-table-column
      label="卖家信息"
      width="150"
    >
      <template slot-scope="scope">
        <div>{{ scope.row.sellerInfo.username }}</div>
        <div style="color: #999;">{{ scope.row.sellerInfo.phone }}</div>
      </template>
    </el-table-column>
    
    <!-- 实际支付 -->
    <el-table-column
      label="实际支付"
      width="120"
      align="right"
    >
      <template slot-scope="scope">
        <div>￥{{ scope.row.totalAmount }}</div>
        <div style="color: #999; font-size: 12px;">
          <span v-if="scope.row.freightPrice > 0">含运费: ￥{{ scope.row.freightPrice }}</span>
        </div>
      </template>
    </el-table-column>
    
    <!-- 下单/支付时间 -->
    <el-table-column
      label="时间信息"
      width="180"
    >
      <template slot-scope="scope">
        <div>下单: {{ formatTime(scope.row.createTime) }}</div>
        <div v-if="scope.row.payTime">支付: {{ formatTime(scope.row.payTime) }}</div>
      </template>
    </el-table-column>
    
    <!-- 订单状态 -->
    <el-table-column
      label="订单状态"
      width="120"
    >
      <template slot-scope="scope">
        <el-tag :type="getStatusType(scope.row.orderStatus)">
          {{ getStatusText(scope.row.orderStatus) }}
        </el-tag>
        <div style="margin-top: 5px;">
          <el-tag v-if="scope.row.paid === 1" size="mini" type="success">已支付</el-tag>
          <el-tag v-else size="mini" type="info">未支付</el-tag>
        </div>
      </template>
    </el-table-column>
    
    <!-- 操作列 -->
    <el-table-column
      label="操作"
      width="120"
    >
      <template slot-scope="scope">
        <el-button
          type="text"
          size="small"
          @click="handleViewDetail(scope.row)"
        >
          查看详情
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 处理多选
    handleSelectionChange(selection) {
      this.$emit('selection-change', selection)
    },
    // 查看详情
    handleViewDetail(row) {
      this.$emit('view-detail', row)
    },
    // 格式化时间
    formatTime(time) {
      if (!time) return '--';
      return time.replace('T', ' ');
    },
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        0: '待发货',
        1: '待收货',
        2: '已完成',
        3: '已取消'
      };
      return statusMap[status] || '未知状态';
    },
    // 获取状态标签类型
    getStatusType(status) {
      const typeMap = {
        0: 'warning',  // 待发货：黄色
        1: 'primary',  // 待收货：蓝色
        2: 'success',  // 已完成：绿色
        3: 'info'      // 已取消：灰色
      };
      return typeMap[status] || '';
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>
