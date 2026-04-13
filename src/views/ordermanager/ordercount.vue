<template>
  <div class="dashboard-container">
    <!-- 数据概览 -->
    <el-row :gutter="20" class="data-overview">
      <el-col :span="8">
        <el-card class="data-card">
          <div class="card-title">总订单量</div>
          <div class="card-value">{{ overviewData.totalOrders || 0 }}</div>
          <div class="card-footer">
            <div class="footer-item">
              <span>已支付订单：</span>
              <span>{{ overviewData.paidOrders || 0 }}</span>
            </div>
            <div class="footer-item">
              <span>支付率：</span>
              <span>{{ ((overviewData.paymentRate || 0) * 100).toFixed(1) }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <div class="card-title">总交易额</div>
          <div class="card-value">¥{{ formatPrice(overviewData.totalAmount) }}</div>
          <div class="card-footer">
            <div class="footer-item">
              <span>总运费：</span>
              <span>¥{{ formatPrice(overviewData.totalFreight) }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="data-card">
          <div class="card-title">订单状态</div>
          <div class="card-content">
            <div class="status-item">
              <span>待发货：</span>
              <span>{{ overviewData.waitingShipment || 0 }}</span>
            </div>
            <div class="status-item">
              <span>待收货：</span>
              <span>{{ overviewData.waitingReceive || 0 }}</span>
            </div>
            <div class="status-item">
              <span>已完成：</span>
              <span>{{ overviewData.completed || 0 }}</span>
            </div>
            <div class="status-item">
              <span>已取消：</span>
              <span>{{ overviewData.cancelled || 0 }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="24">
        <el-card class="chart-card">
          <div class="chart-header">
            <div class="header-left">
              <span class="chart-title">订单趋势分析</span>
            </div>
            <div class="header-right">
              <el-radio-group v-model="timeRange" size="small" @change="fetchTimeAnalysis">
                <el-radio-button label="7">最近7天</el-radio-button>
                <el-radio-button label="30">最近30天</el-radio-button>
                <el-radio-button label="90">最近90天</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div class="chart-content">
            <div ref="trendChart" style="height: 400px"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getOrderOverview, getTimeAnalysis } from '@/api/order'

export default {
  name: 'OrderCount',
  data() {
    return {
      timeRange: '7',
      overviewData: {},
      charts: {
        trendChart: null
      }
    }
  },
  mounted() {
    this.initCharts()
    this.fetchData()
  },
  beforeDestroy() {
    if (this.charts.trendChart) {
      this.charts.trendChart.dispose()
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    formatPrice(price) {
      return (price || 0).toFixed(2)
    },
    initCharts() {
      this.charts.trendChart = echarts.init(this.$refs.trendChart)
      window.addEventListener('resize', this.handleResize)
    },
    handleResize() {
      if (this.charts.trendChart) {
        this.charts.trendChart.resize()
      }
    },
    async fetchData() {
      try {
        const res = await getOrderOverview()
        if (res.code === 200) {
          this.overviewData = res.data
        }
        await this.fetchTimeAnalysis()
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('获取数据失败')
      }
    },
    async fetchTimeAnalysis() {
      try {
        const res = await getTimeAnalysis(this.timeRange)
        if (res.code === 200) {
          this.updateTrendChart(res.data)
        }
      } catch (error) {
        console.error('获取时间分析数据失败:', error)
        this.$message.error('获取时间分析数据失败')
      }
    },
    updateTrendChart(data) {
      const dates = Object.keys(data.dailyOrders || {}).sort()
      const orderValues = dates.map(date => data.dailyOrders[date])
      const amountValues = dates.map(date => data.dailyAmount[date])

      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          },
          formatter: function(params) {
            const date = params[0].axisValue
            const orders = params[0].value
            const amount = params[1].value
            return `${date}<br/>
                    订单量: ${orders}笔<br/>
                    交易额: ¥${amount.toFixed(2)}`
          }
        },
        legend: {
          data: ['订单量', '交易额'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates,
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: [{
          type: 'value',
          name: '订单量',
          position: 'left',
          axisLabel: {
            formatter: '{value}笔'
          }
        }, {
          type: 'value',
          name: '交易额',
          position: 'right',
          axisLabel: {
            formatter: '¥{value}'
          }
        }],
        series: [{
          name: '订单量',
          type: 'line',
          smooth: true,
          data: orderValues,
          itemStyle: {
            color: '#409EFF'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(64, 158, 255, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(64, 158, 255, 0.1)'
            }])
          }
        }, {
          name: '交易额',
          type: 'line',
          smooth: true,
          yAxisIndex: 1,
          data: amountValues,
          itemStyle: {
            color: '#67C23A'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
              offset: 0,
              color: 'rgba(103, 194, 58, 0.3)'
            }, {
              offset: 1,
              color: 'rgba(103, 194, 58, 0.1)'
            }])
          }
        }]
      }
      this.charts.trendChart.setOption(option)
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .data-overview {
    margin-bottom: 20px;

    .data-card {
      height: 200px;
      
      .card-title {
        font-size: 14px;
        color: #606266;
        margin-bottom: 10px;
      }

      .card-value {
        font-size: 24px;
        font-weight: bold;
        color: #303133;
        margin-bottom: 20px;
      }

      .card-footer, .card-content {
        font-size: 13px;
        color: #606266;

        .footer-item, .status-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .chart-card {
    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      .chart-title {
        font-size: 16px;
        font-weight: 500;
        color: #303133;
      }
    }

    .chart-content {
      margin-top: 20px;
    }
  }
}
</style>
