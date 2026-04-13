<template>
  <div class="order-container">
    <el-card>
      <div class="filter-container">
        <el-date-picker
          v-model="queryParams.dateRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
          style="width: 300px; margin-right: 20px"
        />
        <el-button type="primary" @click="handleQuery">查询</el-button>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <el-tab-pane name="pendingDelivery">
          <template #label>
            <span v-if="loading">待发货 (<i class="el-icon-loading"></i>)</span>
            <span v-else>待发货 ({{ pendingDeliveryList.length }})</span>
          </template>
          <order-list :list="pendingDeliveryList" @view-detail="openOrderDetail" />
        </el-tab-pane>
        <el-tab-pane name="pendingReceive">
          <template #label>
            <span v-if="loading">待收货 (<i class="el-icon-loading"></i>)</span>
            <span v-else>待收货 ({{ pendingReceiveList.length }})</span>
          </template>
          <order-list :list="pendingReceiveList" @view-detail="openOrderDetail" />
        </el-tab-pane>
        <el-tab-pane name="completed">
          <template #label>
            <span v-if="loading">已完成 (<i class="el-icon-loading"></i>)</span>
            <span v-else>已完成 ({{ completedList.length }})</span>
          </template>
          <order-list :list="completedList" @view-detail="openOrderDetail" />
        </el-tab-pane>
        <el-tab-pane name="cancelled">
          <template #label>
            <span v-if="loading">已取消 (<i class="el-icon-loading"></i>)</span>
            <span v-else>已取消 ({{ cancelledList.length }})</span>
          </template>
          <order-list :list="cancelledList" @view-detail="openOrderDetail" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 订单详情弹窗 -->
    <el-dialog
      title="订单详情"
      :visible.sync="detailDialogVisible"
      width="75%"
      top="5vh"
    >
      <div v-if="currentOrder" class="order-detail">
        <el-tabs type="border-card">
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">订单号：</span>
                  <span class="value">{{ currentOrder.orderId || '--' }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">订单状态：</span>
                  <el-tag :type="getStatusType(currentOrder.orderStatus)">
                    {{ getStatusText(currentOrder.orderStatus) }}
                  </el-tag>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">支付状态：</span>
                  <el-tag :type="currentOrder.paid === 1 ? 'success' : 'info'">
                    {{ currentOrder.paid === 1 ? '已支付' : '未支付' }}
                  </el-tag>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">创建时间：</span>
                  <span class="value">{{ formatTime(currentOrder.createTime) || '--' }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">支付时间：</span>
                  <span class="value">{{ currentOrder.payTime ? formatTime(currentOrder.payTime) : '--' }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">支付方式：</span>
                  <span class="value">{{ currentOrder.payType || '--' }}</span>
                </div>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">买家名称：</span>
                  <span class="value">{{ currentOrder.userName || '--' }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">买家电话：</span>
                  <span class="value">{{ currentOrder.userPhone || '--' }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="detail-item">
                  <span class="label">收货人：</span>
                  <span class="value">{{ currentOrder.addressInfo ? currentOrder.addressInfo.name : '--' }}</span>
                </div>
              </el-col>
            </el-row>

            <!-- 备注信息 -->
            <el-row :gutter="20">
              <el-col :span="12">
                <div class="detail-item">
                  <span class="label">买家备注：</span>
                  <span class="value">{{ currentOrder.remark || '--' }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="detail-item">
                  <span class="label">卖家备注：</span>
                  <span class="value">{{ currentOrder.mark || '--' }}</span>
                </div>
              </el-col>
            </el-row>
          </el-tab-pane>

          <!-- 商品信息 -->
          <el-tab-pane label="商品信息">
            <el-card v-for="(good, index) in currentOrder.goodsList" :key="`good-${index}`" class="good-card">
              <div class="good-header">
                <span class="good-title">商品 {{ index + 1 }}</span>
                <span class="good-id">ID: {{ good.goodId || '--' }}</span>
              </div>
              <div class="good-body">
                <div class="good-image">
                  <img 
                    v-if="good.goodImage"
                    :src="good.goodImage.startsWith('/') ? `/dev-api${good.goodImage}` : good.goodImage" 
                    style="width: 100px; height: 100px;"
                  />
                  <div v-else class="no-image">暂无图片</div>
                </div>
                <div class="good-info">
                  <div class="good-name">{{ good.goodName || '--' }}</div>
                  <div class="good-price">
                    <span class="label">单价：</span>
                    <span class="price">￥{{ good.price || '0.00' }}</span>
                  </div>
                  <div class="good-quantity">
                    <span class="label">数量：</span>
                    <span class="quantity">{{ good.quantity || '0' }}</span>
                  </div>
                  <div class="good-subtotal">
                    <span class="label">小计：</span>
                    <span class="subtotal">￥{{ good.subtotal || '0.00' }}</span>
                  </div>
                  <div class="good-freight">
                    <span class="label">运费：</span>
                    <span class="freight">￥{{ good.freightPrice || '0.00' }}</span>
                  </div>
                </div>
              </div>
            </el-card>

            <el-card class="order-summary">
              <div class="summary-title">订单汇总</div>
              <div class="summary-item">
                <span class="label">商品总数量：</span>
                <span class="value">{{ currentOrder.totalNum || '0' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">商品总价：</span>
                <span class="value">￥{{ currentOrder.totalPrice || '0.00' }}</span>
              </div>
              <div class="summary-item">
                <span class="label">总运费：</span>
                <span class="value">￥{{ currentOrder.totalFreightPrice || '0.00' }}</span>
              </div>
              <div class="summary-item total-amount">
                <span class="label">订单总金额：</span>
                <span class="value">￥{{ currentOrder.totalAmount || '0.00' }}</span>
              </div>
            </el-card>
          </el-tab-pane>

          <!-- 地址信息 -->
          <el-tab-pane label="地址信息" v-if="currentOrder.addressInfo">
            <el-form label-width="120px" class="address-form">
              <el-form-item label="地址ID:">
                {{ currentOrder.addressInfo.addressId || '--' }}
              </el-form-item>
              <el-form-item label="收货人:">
                {{ currentOrder.addressInfo.name || '--' }}
              </el-form-item>
              <el-form-item label="联系电话:">
                {{ currentOrder.addressInfo.phone || '--' }}
              </el-form-item>
              <el-form-item label="详细地址:">
                {{ currentOrder.addressInfo.addressDetail || '--' }}
              </el-form-item>
              <el-form-item label="是否默认地址:">
                {{ currentOrder.addressInfo.isDefault === 0 ? '是' : '否' }}
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OrderList from "@/components/orderlist/OrderList.vue";
import { getOrderList, getOrderDetail } from "@/api/order";

export default {
  components: {
    OrderList,
  },
  data() {
    return {
      activeTab: "pendingDelivery",
      queryParams: {
        dateRange: [],
      },
      orderList: [], // 存储所有订单数据
      pendingDeliveryList: [], // 待发货
      pendingReceiveList: [], // 待收货
      completedList: [], // 已完成
      cancelledList: [], // 已取消
      loading: false,
      detailDialogVisible: false,
      currentOrder: null,
    };
  },
  methods: {
    handleQuery() {
      this.fetchData();
    },
    handleTabChange(tab) {
      console.log("切换tab:", tab.name);
    },
    async fetchData() {
      this.loading = true;
      try {
        const res = await getOrderList();
        if (res.code === 200) {
          this.orderList = res.data;
          // 根据订单状态分类
          this.pendingDeliveryList = this.orderList.filter(order => order.orderStatus === 0);
          this.pendingReceiveList = this.orderList.filter(order => order.orderStatus === 1);
          this.completedList = this.orderList.filter(order => order.orderStatus === 2);
          this.cancelledList = this.orderList.filter(order => order.orderStatus === 3);
        }
      } catch (error) {
        console.error("获取订单数据失败:", error);
        this.$message.error("获取订单数据失败");
      } finally {
        this.loading = false;
      }
    },
    formatTime(time) {
      if (!time) return '--';
      return time.replace('T', ' ');
    },
    // 打开订单详情弹窗
    async openOrderDetail(order) {
      this.loading = true;
      try {
        // 使用接口获取完整的订单详情
        const res = await getOrderDetail(order.orderId);
        if (res.code === 200) {
          this.currentOrder = res.data;
          this.detailDialogVisible = true;
      } else {
          this.$message.error("获取订单详情失败");
        }
      } catch (error) {
        console.error("获取订单详情失败:", error);
        this.$message.error("获取订单详情失败");
      } finally {
        this.loading = false;
      }
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
  },
  mounted() {
    this.fetchData();
  },
};
</script>

<style lang="scss" scoped>
.order-container {
  padding: 20px;

  .filter-container {
    display: flex;
    align-items: center;
  }

  .order-detail {
    .detail-item {
      margin-bottom: 15px;
      .label {
        color: #606266;
        font-weight: 500;
        margin-right: 8px;
      }
      .value {
        color: #303133;
      }
    }

    .good-card {
      margin-bottom: 15px;

      .good-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;

        .good-title {
          font-weight: bold;
          font-size: 16px;
        }

        .good-id {
          color: #909399;
        }
      }

      .good-body {
        display: flex;

        .good-image {
          margin-right: 20px;
          
          .no-image {
            width: 100px;
            height: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #f5f7fa;
            color: #909399;
          }
        }

        .good-info {
          flex: 1;

          .good-name {
            font-size: 16px;
            margin-bottom: 10px;
          }

          .good-price, .good-quantity, .good-subtotal, .good-freight {
            margin-bottom: 5px;
            
            .label {
              color: #606266;
            }
            
            .price, .subtotal, .freight {
              color: #f56c6c;
            }
          }
        }
      }
    }

    .order-summary {
      margin-top: 20px;
      
      .summary-title {
        font-weight: bold;
        font-size: 16px;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 1px solid #ebeef5;
      }
      
      .summary-item {
        margin-bottom: 10px;
        
        .label {
          color: #606266;
          font-weight: 500;
          margin-right: 8px;
        }
        
        .value {
          color: #303133;
        }
      }
      
      .total-amount {
        margin-top: 15px;
        font-size: 16px;
        padding-top: 10px;
        border-top: 1px solid #ebeef5;
        
        .value {
          color: #f56c6c;
          font-weight: bold;
        }
      }
    }

    .address-form, .system-form {
      max-width: 600px;
      margin: 0 auto;
    }
  }
}
</style>
