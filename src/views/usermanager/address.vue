<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="收货人名称" prop="name">
          <el-input v-model="queryForm.name" placeholder="请输入收货人名称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="tel">
          <el-input v-model="queryForm.tel" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="校园楼" prop="floorName">
          <el-input
            v-model="queryForm.floorName"
            placeholder="请输入校园楼名称"
          />
        </el-form-item>
        <el-form-item label="创建时间">
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
        @click="handleDelAddressIds"
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
          prop="name"
          label="收货人名称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="floorName" label="校园楼名称" align="center">
        </el-table-column>
        <el-table-column prop="addressDetail" label="详细收获地址" align="center">
        </el-table-column>
        <el-table-column prop="tel" label="手机号码" align="center">
        </el-table-column>
        <el-table-column label="是否默认地址" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isDefault"
              :active-value="0"
              :inactive-value="1"
              @change="handleDefaultChange(scope.row, $event)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              plain
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <template>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="handleDelete(scope.row)"
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
    <el-dialog
      title="修改地址"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <el-form
        :rules="addressFormRules"
        ref="addressFormRef"
        :model="addressForm"
        label-width="120px"
      >
        <el-form-item label="收获人名称" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收获人名称" />
        </el-form-item>
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addressForm.username" :disabled="true" />
        </el-form-item>
        <el-form-item label="校园楼" prop="floorName">
          <el-select
            @change="handleChange"
            v-model="addressForm.floorName"
            placeholder="请选择教学楼"
          >
            <el-option
              v-for="item in floorData"
              :key="item.floorId"
              :label="item.floorName"
              :value="item.floorId + '_' + item.floorName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="tel">
          <el-input v-model="addressForm.tel" placeholder="请输入手机号码" />
        </el-form-item>
        <el-form-item label="详细地址" prop="addressDetail">
          <el-input
            v-model="addressForm.addressDetail"
            placeholder="请输入详细地址"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAddresList,
  getAddressById,
  removeAddress,
  removeAddressByIds,
  setDefaultAddress,
  updateAddress,
} from "@/api/address";
import { getFloorAll } from "@/api/floor";

export default {
  data() {
    return {
      selectDate: [],
      dialogVisible: false,
      floorData: [],
      tableData: [],
      multipleSelection: [],
      //   查询地址表单
      queryForm: {
        name: "",
        tel: "",
        username: "",
        floorName: "",
        starttime: null,
        endtime: null,
        pageNum: 1,
        pageSize: 10,
      },
      addressForm: {
        addressId: null,
        name: "",
        username: "",
        floorName: "",
        isDefault: null,
        tel: "",
        addressDetail: "",
      },
      total: 0,
      addressFormRules: {
        name: [
          { required: true, message: "请输入收货人名称", trigger: "blur" },
        ],
        floorName: [
          { required: true, message: "请选择校园楼", trigger: "change" },
        ],
        tel: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        addressDetail: [
          { required: true, message: "请输入详细收获地址", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getAddresss();
    // 获取全部教学楼
    this.getFloorAll();
  },
  methods: {
    getAddresss() {
      getAddresList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    getFloorAll() {
      getFloorAll()
        .then((res) => {
          this.floorData = res.data;
        })
        .catch((err) => {});
    },
    // 用户选择查找日期触发事件
    handleDateChange() {
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
    },
    Search() {
      this.getAddresss();
    },
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getAddresss();
    },
    handleDefaultChange(row, val) {
      this.addressForm = row;
      setDefaultAddress(this.addressForm)
        .then((res) => {
          this.$message({
            type: "success",
            message: "设置默认地址成功",
          });
          // 重新获取数据
          this.getAddresss();
        })
        .catch((err) => {});
    },
    handleEdit(row) {
      this.addressForm = row;
      getAddressById(row.addressId)
        .then((res) => {
          this.addressForm = res.data;
        })
        .catch((err) => {});
      this.dialogVisible = true;
    },
    handleChange(val) {
      this.addressForm.floorId = val.split("_")[0];
    },
    handleSubmit() {
      this.$refs.addressFormRef.validate((valid) => {
        if (valid) {
          // 编辑数据
          updateAddress(this.addressForm)
            .then((res) => {
              this.$message({
                type: "success",
                message: "编辑成功",
              });
              // 关闭弹窗
              this.dialogVisible = false;
              // 重新获取数据
              this.getAddresss();
            })
            .catch((err) => {});
        }
      });
    },
    handleDelete(row) {
      removeAddress(row.addressId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          // 重新获取数据
          this.getAddresss();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelAddressIds() {
      let addressids = this.multipleSelection.map((item) => item.addressId);
      removeAddressByIds(addressids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getAddresss();
        })
        .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDialogClose() {
      this.addressForm = {
        addressId: null,
        name: "",
        username: "",
        floorName: "",
        isDefault: null,
        tel: "",
        addressDetail: "",
      };
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getVipUsers();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getVipUsers();
    },
  },
};
</script>

<style lang="scss" scoped></style>
