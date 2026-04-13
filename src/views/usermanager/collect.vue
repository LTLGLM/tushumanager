<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="收藏用户" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="商品名称" prop="goodName">
          <el-input v-model="queryForm.goodName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="商品价格范围" class="priceStyle">
          <el-input v-model="queryForm.startprice" placeholder="最低价" />
          -
          <el-input v-model="queryForm.endprice" placeholder="最高价" />
        </el-form-item>
        <el-form-item label="收藏时间">
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
        :disabled="!multipleSelection.length > 0"
        @click="handleDelCollectIds"
        >批量删除</el-button
      >
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table
        :data="tableData"
        style="width: 100%"
        :highlight-current-row="true"
        empty-text="暂无数据"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center"> </el-table-column>
        <el-table-column prop="collectId" label="编号" align="center">
        </el-table-column>
        <el-table-column prop="username" label="收藏用户" align="center">
        </el-table-column>
        <el-table-column prop="goodName" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="image" label="商品图片" align="center">
          <template slot-scope="scope">
            <img
              :src="'/dev-api/' + scope.row.image"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodInfo" label="商品简介" align="center">
        </el-table-column>
        <el-table-column prop="price" label="商品价格" align="center">
        </el-table-column>
        <el-table-column prop="addTime" label="收藏时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="showCollectInfo(scope.row)"
              >详情</el-button
            >
            <template>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="delRow(scope.row)"
              >
                <el-button
                  icon="el-icon-delete"
                  size="mini"
                  type="text"
                  slot="reference"
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.pageNum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="queryForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import {
  getCollectList,
  removeCollectById,
  removeCollectByIds,
} from "@/api/collect";

export default {
  data() {
    return {
      selectDate: [],
      tableData: [],
      multipleSelection: [],
      //   查询会员表单
      queryForm: {
        username: "",
        goodName: "",
        startprice: null,
        endprice: null,
        starttime: null,
        endtime: null,
        pageSize: 10,
        pageNum: 1,
      },
      collectForm: {
        collectId: null,
        username: "",
        goodName: "",
        image: "",
        goodInfo: "",
        price: null,
        addTime: null,
      },
      total: 0,
    };
  },
  mounted() {
    this.getCollects();
  },
  methods: {
    formatTime(time) {
      if (!time) return '--';
      // 将 T 替换为空格
      return time.replace('T', ' ');
    },
    getCollects() {
      getCollectList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    handleDateChange() {
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
    },
    Search() {
      this.getCollects();
    },
    // 重置搜索表单
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.queryForm.startprice = null;
      this.queryForm.endprice = null;
      this.getCollects();
    },
    showCollectInfo(row) {},
    delRow(row) {
      removeCollectById(row.collectId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getCollects();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelCollectIds() {
      let collecIds = this.multipleSelection.map((item) => item.collectId);
      removeCollectByIds(collecIds)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getCollects();
        })
        .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getCollects();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getCollects();
    },
  },
};
</script>

<style lang="scss" scoped>
.priceStyle {
  ::v-deep .el-input {
    width: 40%;
  }
}
</style>
