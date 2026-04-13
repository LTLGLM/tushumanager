<template>
  <div class="user-stat-container">
    <!-- 用户基础信息卡片 -->
    <el-row :gutter="20" class="stat-cards">
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="icon-wrapper">
            <i class="el-icon-user"></i>
          </div>
          <div class="stat-content">
            <div class="stat-title">总用户数</div>
            <div class="stat-value">{{ basicStats.totalUsers || 0 }}</div>
            <div class="stat-trend" v-if="registrationStats.monthlyGrowthRate">
              <span>月增长率：</span>
              <span
                :class="{
                  up: parseFloat(registrationStats.monthlyGrowthRate) > 0,
                }"
              >
                {{ registrationStats.monthlyGrowthRate }}
                <i
                  :class="
                    parseFloat(registrationStats.monthlyGrowthRate) > 0
                      ? 'el-icon-top'
                      : 'el-icon-bottom'
                  "
                ></i>
              </span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div class="icon-wrapper" style="background-color: #67c23a20">
            <i class="el-icon-date" style="color: #67c23a"></i>
            </div>
          <div class="stat-content">
            <div class="stat-title">平均年龄</div>
            <div class="stat-value">{{ ageStats.averageAge || "0" }}岁</div>
            <div class="stat-desc">主要年龄段分布</div>
            </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="stat-card">
          <div
            class="icon-wrapper"
            style="background-color: #e6a23c20; position: relative; top: 0px"
          >
            <i class="el-icon-data-analysis" style="color: #e6a23c"></i>
            </div>
          <div class="stat-content">
            <div class="stat-title">性别比例</div>
            <div class="stat-chart" style="position: relative;margin-top: -80px;margin-left: 120px;">
              <div ref="genderChart" style="height: 150px; width: 200px"></div>
            </div>
      </div>
    </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" class="stat-charts">
      <el-col :span="16">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">用户注册趋势</span>
            <el-radio-group
              v-model="timeRange"
              size="small"
              @change="updateTrendChart"
            >
              <el-radio-button label="week">最近7天</el-radio-button>
              <el-radio-button label="month">月度趋势</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-content">
            <div ref="trendChart" style="height: 350px"></div>
          </div>
      </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">年龄分布</span>
          </div>
          <div class="chart-content">
            <div ref="ageChart" style="height: 350px"></div>
          </div>
      </el-card>
      </el-col>
    </el-row>

    <!-- 用户画像分析 -->
    <el-row class="stat-charts">
      <el-col :span="24">
        <el-card class="chart-card">
          <div class="chart-header">
            <span class="chart-title">用户画像分析</span>
          </div>
          <div class="chart-content">
            <div ref="portraitChart" style="height: 400px"></div>
    </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from "echarts";
import {
  getUserBasicStats,
  getUserAgeStats,
  getUserRegistrationTrend,
  getUserPortrait,
} from "@/api/user";

export default {
  name: "VipUserCount",
  data() {
    return {
      timeRange: "week",
      basicStats: {},
      ageStats: {},
      registrationStats: {},
      portraitStats: {},
      charts: {
        genderChart: null,
        trendChart: null,
        ageChart: null,
        portraitChart: null,
      },
    };
  },
  mounted() {
    this.initCharts();
    this.fetchAllData();
  },
  beforeDestroy() {
    Object.values(this.charts).forEach((chart) => {
      if (chart) {
        chart.dispose();
      }
    });
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    initCharts() {
      if (this.$refs.genderChart) {
        this.charts.genderChart = echarts.init(this.$refs.genderChart);
      }
      
      if (this.$refs.trendChart) {
        this.charts.trendChart = echarts.init(this.$refs.trendChart);
      }
      
      if (this.$refs.ageChart) {
        this.charts.ageChart = echarts.init(this.$refs.ageChart);
      }
      
      if (this.$refs.portraitChart) {
        this.charts.portraitChart = echarts.init(this.$refs.portraitChart);
      }
      
      window.addEventListener("resize", this.handleResize);
    },
    handleResize() {
      Object.values(this.charts).forEach((chart) => {
        if (chart) {
          chart.resize();
        }
      });
    },
    async fetchAllData() {
      this.$nextTick(() => {
        this.initCharts();
      });
      
      try {
        const [basicRes, ageRes, registrationRes, portraitRes] =
          await Promise.all([
            getUserBasicStats().catch(err => {
              console.error("获取基础统计数据失败:", err);
              return { code: 500 };
            }),
            getUserAgeStats().catch(err => {
              console.error("获取年龄统计数据失败:", err);
              return { code: 500 };
            }),
            getUserRegistrationTrend().catch(err => {
              console.error("获取注册趋势数据失败:", err);
              return { code: 500 };
            }),
            getUserPortrait().catch(err => {
              console.error("获取用户画像数据失败:", err);
              return { code: 500 };
            }),
          ]);

        if (basicRes.code === 200) {
          this.basicStats = basicRes.data || {};
          this.updateGenderChart();
        }
        
        if (ageRes.code === 200) {
          this.ageStats = ageRes.data || {};
          this.updateAgeChart();
        }
        
        if (registrationRes.code === 200) {
          this.registrationStats = registrationRes.data || {};
          
          if (this.registrationStats.recentRegistration && 
              Object.keys(this.registrationStats.recentRegistration).length === 0) {
            this.timeRange = "month";
          }
          
          this.$nextTick(() => {
            this.updateTrendChart();
          });
        } else {
          this.$nextTick(() => {
            this.updateTrendChart();
          });
        }
        
        if (portraitRes.code === 200) {
          this.portraitStats = portraitRes.data || {};
          this.updatePortraitChart();
        }
      } catch (error) {
        console.error("获取数据失败:", error);
        this.$message.error("获取数据失败");
      }
    },
    updateGenderChart() {
      const genderData = Object.entries(
        this.basicStats.genderDistribution || {}
      ).map(([name, value]) => ({
        name,
        value,
      }));

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}人 ({d}%)",
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: "pie",
            radius: ["60%", "80%"],
            center: ["50%", "50%"],
            data: genderData,
            label: {
              show: true,
              position: "center",
              formatter: (params) => {
                const total = genderData.reduce(
                  (sum, item) => sum + item.value,
                  0
                );
                const percent = ((params.value / total) * 100).toFixed(1);
                return `${params.name}\n${percent}%`;
              },
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "14",
                fontWeight: "bold",
              },
            },
          },
        ],
      };
      this.charts.genderChart.setOption(option);
    },
    updateTrendChart() {
      if (!this.registrationStats || 
          (!this.registrationStats.recentRegistration && 
           !this.registrationStats.monthlyRegistration)) {
        console.warn("没有有效的注册趋势数据");
        
        const emptyOption = {
          title: {
            text: '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 16
            }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        };
        
        if (this.charts.trendChart) {
          this.charts.trendChart.setOption(emptyOption);
        }
        return;
      }
      
      const sourceData = this.timeRange === "week"
          ? this.registrationStats.recentRegistration || {}
          : this.registrationStats.monthlyRegistration || {};
      
      const data = typeof sourceData === 'object' ? sourceData : {};
      
      const dates = Object.keys(data).sort();
      const values = dates.map((date) => data[date] || 0);

      if (dates.length === 0) {
        const emptyOption = {
          title: {
            text: this.timeRange === "week" ? '近7天无注册数据，请查看月度趋势' : '暂无数据',
            left: 'center',
            top: 'center',
            textStyle: {
              color: '#999',
              fontSize: 16
            }
          },
          xAxis: { show: false },
          yAxis: { show: false },
          series: []
        };
        
        if (this.charts.trendChart) {
          this.charts.trendChart.setOption(emptyOption);
        }
        return;
      }

      const formattedDates = dates.map(date => {
        if (this.timeRange === "week") {
          return date;
        } else {
          const [year, month] = date.split('-');
          return `${year}年${month}月`;
        }
      });

      const option = {
        tooltip: {
          trigger: "axis",
          formatter: "{b}<br/>新增用户：{c}人",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: formattedDates,
          axisLabel: {
            rotate: 45,
          },
        },
        yAxis: {
          type: "value",
          name: "用户数",
          minInterval: 1,
        },
        series: [
          {
            name: "新增用户",
            type: "line",
            smooth: true,
            data: values,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: "rgba(64, 158, 255, 0.3)",
                },
                {
                  offset: 1,
                  color: "rgba(64, 158, 255, 0.1)",
                },
              ]),
            },
            itemStyle: {
              color: "#409EFF",
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}人'
            }
          },
        ],
      };
      
      if (this.charts.trendChart) {
        this.charts.trendChart.setOption(option);
      } else {
        console.error("趋势图表实例不存在");
      }
    },
    updateAgeChart() {
      const ageData = Object.entries(this.ageStats.ageDistribution || {}).map(
        ([name, value]) => ({
          name,
          value,
        })
      );

      const option = {
        tooltip: {
          trigger: "item",
          formatter: "{b}: {c}人 ({d}%)",
        },
        legend: {
          orient: "vertical",
          right: 10,
          top: "center",
        },
        series: [
          {
            type: "pie",
            radius: "65%",
            center: ["40%", "50%"],
            data: ageData.sort((a, b) => b.value - a.value),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
            label: {
              formatter: "{b}: {d}%",
            },
          },
        ],
      };
      this.charts.ageChart.setOption(option);
    },
    updatePortraitChart() {
      const data = this.portraitStats;
      const genders = Object.keys(data || {});
      const ageGroups = Object.keys(data[genders[0]] || {});
      const series = genders.map((gender) => ({
        name: gender,
        type: "bar",
        data: ageGroups.map((age) => data[gender][age]),
      }));

      const option = {
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {
          data: genders,
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          data: ageGroups,
        },
        yAxis: {
          type: "value",
          name: "用户数",
        },
        series: series.map((item) => ({
          ...item,
          barMaxWidth: 35,
        })),
      };
      this.charts.portraitChart.setOption(option);
    },
  },
};
</script>

<style lang="scss" scoped>
.user-stat-container {
  padding: 20px;

  .stat-cards {
    margin-bottom: 20px;

    .stat-card {
      height: 120px;
      display: flex;
      align-items: center;
      padding: 20px;

      .icon-wrapper {
        width: 48px;
        height: 48px;
        border-radius: 8px;
        background-color: #409eff20;
          display: flex;
          align-items: center;
          justify-content: center;
        margin-right: 20px;

        i {
          font-size: 24px;
          color: #409eff;
        }
      }

      .stat-content {
        flex: 1;

        .stat-title {
          font-size: 14px;
          color: #606266;
          margin-bottom: 8px;
        }

        .stat-value {
            font-size: 24px;
          font-weight: bold;
          color: #303133;
          margin-bottom: 8px;
        }

        .stat-trend,
        .stat-desc {
          font-size: 13px;
          color: #909399;

          .up {
            color: #67c23a;
          }
        }

        .stat-chart {
          margin-top: -10px;
        }
      }
    }
  }

  .stat-charts {
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0;
    }

    .chart-card {
      .chart-header {
  display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding: 0 20px;

        .chart-title {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
        }
      }

      .chart-content {
        padding: 0 20px 20px;
      }
    }
  }
}
</style>
