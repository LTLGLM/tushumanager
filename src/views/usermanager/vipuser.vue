<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="queryForm.mobile" placeholder="请输入手机号码" />
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
        @click="addVipUser"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="!multipleSelection.length > 0"
        @click="handleDelVipUserIds"
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
          prop="userId"
          label="用户ID"
          width="180"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="avatar" label="头像" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar" style="width: 50px; height: 50px" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名称" align="center">
        </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            {{
              scope.row.gender == 1
                ? "男"
                : scope.row.gender == 2
                ? "女"
                : "未知"
            }}
          </template>
        </el-table-column>
        <el-table-column prop="birthday" label="生日" align="center">
        </el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
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
        :rules="vipUserFormRules"
        ref="vipUserFormRef"
        :model="vipUserForm"
        label-width="120px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input
            v-model="vipUserForm.username"
            placeholder="请输入用户名称"
          />
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="{ Token: getToken() }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="vipUserForm.avatar"
              :src="vipUserForm.avatar"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input
            v-model="vipUserForm.password"
            placeholder="请输入登录密码"
            type="password"
            show-password
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <template>
            <el-radio-group v-model="vipUserForm.gender">
              <el-radio :label="0">未知</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>
        <el-form-item label="生日" prop="birthday">
          <el-date-picker
            v-model="vipUserForm.birthday"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="vipUserForm.mobile" placeholder="请输入手机号码" />
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
  addVipUser,
  deleteVipUser,
  deleteVipUsers,
  getVipUserById,
  getVipUserList,
  updateVipUser,
} from "@/api/vipuser";
import { GET_SESSION_KEY } from "@/utils/sessionStorage";

export default {
  data() {
    var passwordRule = (rule, value, callback) => {
      if (this.title == "添加用户") {
        if (!value) {
          callback(new Error("请填写登录密码"));
        } else if (value.length < 6) {
          callback(new Error("密码长度最少为 6 位"));
        } else {
          callback();
        }
      } else {
        if (value) {
          if (value.length < 6) {
            callback(new Error("密码长度最少为 6 位"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return {
      title: "",
      uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
      selectDate: [],
      tableData: [],
      dialogVisible: false,
      //   查询会员表单
      queryForm: {
        username: "",
        mobile: "",
        starttime: null,
        endtime: null,
        pageNum: 1,
        pageSize: 10,
      },
      vipUserForm: {
        userId: null,
        avatar: "",
        username: "",
        gender: 0,
        password: "123456",
        birthday: null,
        mobile: "",
      },
      total: 0,
      multipleSelection: [],
      vipUserFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 2,
            max: 50,
            message: "用户名长度在 2 到 50 个字符",
            trigger: "blur",
          },
        ],
        avatar: [{ required: true, message: "请上传头像", trigger: "change" }],
        password: [{ required: true, validator: passwordRule }],
        gender: [{ required: true, message: "请选择性别", trigger: "change" }],
        birthday: [{ required: true, message: "请选择生日", trigger: "blur" }],
        mobile: [
          { required: true, message: "请输入手机号码", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getVipUsers();
  },
  methods: {
    // 获取Token
    getToken() {
      return GET_SESSION_KEY("Token");
    },
    getVipUsers() {
      getVipUserList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    // 用户选择查找日期触发事件
    handleDateChange() {
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
    },
    Search() {
      this.getVipUsers();
    },
    // 重置搜索表单
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getVipUsers();
    },

    addVipUser() {
      this.title = "添加用户";
      this.dialogVisible = true;
    },
    editRow(row) {
      this.title = "编辑用户";
      this.vipUserForm = row;
      getVipUserById(row.userId)
        .then((res) => {
          this.vipUserForm = res.data;
        })
        .catch((err) => {});

      this.dialogVisible = true;
    },
    handleAvatarSuccess(response, file, fileList) {
      this.vipUserForm.avatar = process.env.VUE_APP_BASE_API + response.data;
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
      this.$refs.vipUserFormRef.validate(async (valid) => {
        if (valid) {
          if (this.vipUserForm.userId) {
            await updateVipUser(this.vipUserForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "编辑成功!",
                  duration: 1000,
                });
              })
              .catch((err) => {});
          } else {
            await addVipUser(this.vipUserForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "添加成功!",
                  duration: 1000,
                });
              })
              .catch((err) => {});
          }
          this.getVipUsers();
          this.dialogVisible = false;
        }
      });
    },
    delRow(row) {
      deleteVipUser(row.userId)
        .then((res) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getVipUsers();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelVipUserIds() {
      let vipUserids = this.multipleSelection.map((item) => item.userId);
      deleteVipUsers(vipUserids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getVipUsers();
        })
        .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDialogClose() {
      this.vipUserForm = {
        userId: null,
        avatar: "",
        username: "",
        gender: 0,
        password: "123456",
        birthday: null,
        mobile: "",
      };
      this.dialogVisible = false;
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
