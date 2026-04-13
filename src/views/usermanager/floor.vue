<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
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
        type="primary"
        plain
        icon="el-icon-plus"
        @click="addFloor"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="!multipleSelection.length > 0"
        @click="handleDelFloorIds"
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
        fit
      >
        <el-table-column type="selection" align="center"> </el-table-column>
        <el-table-column
          prop="floorId"
          label="校园楼ID"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="floorName" label="校园楼名称" align="center">
        </el-table-column>
        <el-table-column prop="floorImage" label="校园楼图片" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.floorImage"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="editRow(scope.row)"
              >编辑</el-button
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
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <el-form
        :rules="floorFormRules"
        ref="floorFormRef"
        :model="floorForm"
        label-width="120px"
      >
        <el-form-item label="校园楼名称" prop="floorName">
          <el-input
            v-model="floorForm.floorName"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="校园楼图片" prop="floorImage">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="{ Token: getToken() }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="floorForm.floorImage"
              :src="floorForm.floorImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  addFloor,
  removeFloorById,
  removeFloorByIds,
  getFloorById,
  getFloorList,
  updateFloor,
} from "@/api/floor.js";
import { GET_SESSION_KEY } from "@/utils/sessionStorage";

export default {
  data() {
    return {
      title: "",
      uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
      selectDate: [],
      tableData: [],
      dialogVisible: false,
      //   查询会员表单
      queryForm: {
        floorName: "",
        starttime: null,
        endtime: null,
        pageNum: 1,
        pageSize: 10,
      },
      floorForm: {
        floorId: null,
        floorName: "",
        floorImage: "",
        createTime: null,
      },
      total: 0,
      multipleSelection: [],
      floorFormRules: {
        floorName: [
          { required: true, message: "请输入校园楼名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "校园楼名称长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
      },
    };
  },
  mounted() {
    this.getFloors();
  },
  methods: {
    // 获取Token
    getToken() {
      return GET_SESSION_KEY("Token");
    },
    formatTime(time) {
      if (!time) return '--';
      // 将 T 替换为空格
      return time.replace('T', ' ');
    },
    getFloors() {
      getFloorList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    // 用户选择查找日期触发事件
    handleDateChange() {
      console.log(this.selectDate);
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
      console.log(this.queryForm);
    },
    Search() {
      this.getFloors();
    },
    // 重置搜索表单
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getFloors();
    },

    addFloor() {
      this.title = "添加校园楼";
      this.dialogVisible = true;
    },
    editRow(row) {
      this.title = "编辑校园楼";
      this.floorForm = row;
      getFloorById(row.floorId)
        .then((res) => {
          this.floorForm = res.data;
        })
        .catch((err) => {});
      this.dialogVisible = true;
    },
    handleAvatarSuccess(response, file, fileList) {
      this.floorForm.floorImage = process.env.VUE_APP_BASE_API + response.data;
    },
    // 上传前校检格式和大小
    handleBeforeUpload(file) {
      const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
      const isJPG = type.includes(file.type);
      // 检验文件格式
      if (!isJPG) {
        this.$message.error(`图片格式错误!`);
        return false;
      }
      // 校检文件大小
      if (this.fileSize) {
        const isLt = file.size / 1024 / 1024 < this.fileSize;
        if (!isLt) {
          this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
          return false;
        }
      }
      return true;
    },
    handleSubmit() {
      this.$refs.floorFormRef.validate(async (valid) => {
        if (valid) {
          if (this.floorForm.floorId) {
            await updateFloor(this.floorForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "编辑成功!",
                  duration: 1000,
                });
              })
              .catch((err) => {});
          } else {
            await addFloor(this.floorForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "添加成功!",
                  duration: 1000,
                });
              })
              .catch((err) => {});
          }
          this.getFloors();
          this.dialogVisible = false;
        }
      });
    },
    delRow(row) {
      123431;
      removeFloorById(row.floorId)
        .then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getFloors();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelFloorIds() {
      let floorids = this.multipleSelection.map((item) => item.floorId);
      removeFloorByIds(floorids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getFloors();
        })
        .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDialogClose() {
      this.floorForm = {
        floorId: null,
        floorName: "",
        floorImage: "",
        createTime: null,
      };
      this.dialogVisible = false;
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getFloors();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getFloors();
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-tag {
  margin-right: 10px;
}
</style>
