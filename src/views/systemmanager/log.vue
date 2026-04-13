<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="登录地址" prop="loginLocation">
          <el-input
            v-model="queryForm.loginLocation"
            placeholder="请输入登录地址"
          />
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-input v-model="queryForm.status" placeholder="登录状态" />
        </el-form-item>
        <el-form-item label="登录时间" prop="date">
          <el-date-picker
            class="datapicker"
            v-model="selectDate"
            type="datetimerange"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            end-placeholder="结束日期"
            :default-time="['00:00:00']"
            @change="handleDateChange"
          >
          </el-date-picker>
        </el-form-item>
      </Query>
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="multipleSelection.length === 0"
        @click="handleDelLogIds"
        >批量删除</el-button
      >
    </el-card>

    <el-card style="margin-top: 10px">
      <el-table
        :data="tableData"
        style="width: 100%; margin-top: 10px"
        :highlight-current-row="true"
        empty-text="暂无数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"> </el-table-column>
        <el-table-column
          prop="logId"
          label="访问编号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="username" label="用户名称" align="center">
        </el-table-column>
        <el-table-column prop="loginLocation" label="登录地址" align="center">
        </el-table-column>
        <el-table-column prop="browser" label="浏览器" align="center">
        </el-table-column>
        <el-table-column prop="os" label="操作系统" align="center">
        </el-table-column>
        <el-table-column prop="status" label="登录状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === 0 ? 'success' : 'danger'"
              size="small"
              >{{ scope.row.status === 0 ? "成功" : "失败" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="loginTime" label="登录日期" align="center">
          <template slot-scope="scope">
            {{ scope.row.loginTime | dateFormat }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getLogList, removeLogs } from "@/api/log";

export default {
  data() {
    return {
      selectDate: [],
      tableData: [],
      //   查询会员表单
      queryForm: {
        loginLocation: "",
        username: "",
        status: "",
        starttime: null,
        endtime: null,
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      multipleSelection: [],
    };
  },
  mounted() {
    this.getLogs();
  },
  methods: {
    getLogs() {
      getLogList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    Search() {
      this.getLogs();
    },
    // 重置搜索表单
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getLogs();
    },
    handleDateChange() {
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDelLogIds() {
      let logids = this.multipleSelection.map((item) => item.logId);
      removeLogs(logids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getLogs();
        })
        .catch((err) => {});
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getLogs();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getLogs();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form-item {
  display: flex;
  margin-right: 20px;
}
</style>
