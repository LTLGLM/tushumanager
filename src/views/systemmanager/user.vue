<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-input v-model="queryForm.roles" placeholder="角色" />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime">
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
        @click="handlerAddAdmin"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="multipleSelection.length === 0"
        @click="handleDelAdminIds"
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
          prop="adminId"
          label="用户编号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名称"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="roles" label="角色" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="role in scope.row.roles"
              :key="role.roleId"
              size="small"
              type="primary"
            >
              {{ role.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginIp"
          label="最后一次登录IP"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="avatar" label="用户头像" align="center">
          <template slot-scope="scope">
            <img
              :src="scope.row.avatar"
              alt="头像"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.createTime | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="text"
              @click="editRow(scope.row)"
            >
              编辑
            </el-button>
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
        :page-sizes="[3, 5, 7, 10]"
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
      @open="handleOpen"
    >
      <el-form
        :rules="adminFormRules"
        ref="adminFormRef"
        :model="adminForm"
        label-width="80px"
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="adminForm.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model="adminForm.password"
            placeholder="请输入用户密码"
            type="password"
            :show-password="true"
          />
        </el-form-item>
        <el-form-item label="角色" prop="roles" class="roleTagClass">
          <el-button
            v-if="!addRoleTagVisble"
            @click="handleAddSelect()"
            type="primary"
            plain
            >+</el-button
          >
          <el-select
            @change="handleChange"
            v-model="selectRoleValue"
            v-else
            placeholder="请选择角色"
          >
            <el-option
              v-for="item in selectRoleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId + '_' + item.roleName"
            >
            </el-option>
          </el-select>
          <el-tag
            v-for="(item, index) in adminForm.roles"
            :key="index"
            closable
            @close="handleTagClose(item)"
          >
            {{ item.roleName }}
          </el-tag>
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="{ Token: getToken() }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="handleBeforeUpload"
          >
            <img
              v-if="adminForm.avatar"
              :src="adminForm.avatar"
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
  addAdminUser,
  getAdminById,
  getAdminList,
  removeAdminUser,
  removeAdminUserIds,
  updateAdminUser,
} from "@/api/admin";
import { getSelectRoles } from "@/api/role";
import { GET_SESSION_KEY } from "@/utils/sessionStorage";

export default {
  data() {
    let checkPasswordTwo = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (String(value).length < 6 || String(value).length > 12) {
        callback(new Error("密码长度应在6-12"));
      } else {
        callback();
      }
    };
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
      // 添加和编辑用户弹窗
      dialogVisible: false,
      // 控制添加角色按钮
      addRoleTagVisble: false,
      // 弹窗标题
      title: "",
      // 全部角色数据
      roleOptions: [],
      // 用户表格数据
      tableData: [],
      // 选择的角色
      selectRoleValue: "",
      // 查询的日期时间
      selectDate: [],
      // 多选列表项
      multipleSelection: [],
      //   查询会员表单
      queryForm: {
        username: "",
        roles: "",
        starttime: null,
        endtime: null,
        pageNum: 1,
        pageSize: 3,
      },
      total: 0,
      adminForm: {
        adminId: null,
        username: "",
        password: "123456",
        roles: [],
        avatar: "",
      },
      // 添加或编辑用户表单验证
      adminFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        password: [],
        roles: [{ required: true, message: "请选择角色", trigger: "blur" }],
        avatar: [{ required: true, message: "请上传头像", trigger: "blur" }],
      },
      // 编辑用户表单密码效验
      passwordOne: [
        { required: true, message: "请输入用户密码", trigger: "blur" },
        {
          required: true,
          min: 6,
          max: 12,
          message: "密码长度不符合",
          trigger: "blur",
        },
      ],
      passwordTwo: [{ validator: checkPasswordTwo, trigger: "blur" }],
    };
  },
  computed: {
    selectRoleList() {
      // 已有角色列表
      let roles = new Set(this.adminForm.roles.map((role) => role.roleId));
      // 过滤出没有的角色
      return this.roleOptions.filter((role) => !roles.has(role.roleId));
    },
  },
  mounted() {
    this.getAdmins();
  },
  methods: {
    // 获取Token
    getToken() {
      return GET_SESSION_KEY("Token");
    },
    // 获取用户列表
    getAdmins() {
      getAdminList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 用户选择查找日期触发事件
    handleDateChange() {
      this.queryForm.starttime = this.selectDate[0];
      this.queryForm.endtime = this.selectDate[1];
    },
    // 搜索
    Search() {
      this.getAdmins();
    },
    // 重置搜索表单
    Refresh(refName) {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getAdmins();
    },
    // 打开弹窗的事件
    handleOpen() {
      getSelectRoles()
        .then((res) => {
          this.roleOptions = res.data;
        })
        .catch((err) => {});
    },
    // 开启选择角色框
    handleAddSelect() {
      this.addRoleTagVisble = true;
      this.selectRoleValue = "";
    },
    // 打开添加用户弹窗
    handlerAddAdmin() {
      this.title = "添加用户";
      this.adminForm.password = "123456";
      this.adminFormRules.password = this.passwordOne;
      this.dialogVisible = true;
    },
    // 选择角色框触发
    handleChange(el) {
      let rolearr = el.split("_");
      let role = {
        roleId: Number(rolearr[0]),
        roleName: rolearr[1],
      };
      this.adminForm.roles.push(role);
      this.addRoleTagVisble = false;
    },
    // 删除角色标签
    handleTagClose(item) {
      console.log(item);
      this.adminForm.roles.splice(this.adminForm.roles.indexOf(item), 1);
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
    // 上传头像成功的回调函数
    handleAvatarSuccess(response, file, fileList) {
      this.adminForm.avatar = process.env.VUE_APP_BASE_API + response.data;
    },
    // 提交表单
    handleSubmit() {
      this.$refs.adminFormRef.validate(async (valid) => {
        if (valid) {
          // 添加用户
          if (this.title == "添加用户") {
            await addAdminUser(this.adminForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
              })
              .catch((err) => {});
          } else {
            // 编辑用户
            await updateAdminUser(this.adminForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "更新成功",
                });
              })
              .catch((err) => {});
          }
          this.dialogVisible = false;
          this.getAdmins();
        }
      });
    },
    // 编辑用户事件
    editRow(row) {
      this.adminForm.password = null;
      this.adminFormRules.password = this.passwordTwo;
      this.adminForm = row;
      getAdminById(row.adminId)
        .then((res) => {
          this.adminForm = res.data;
        })
        .catch((err) => {});
      this.title = "编辑用户";
      this.dialogVisible = true;
    },
    // 删除用户事件
    delRow(row) {
      removeAdminUser(row.adminId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          this.getAdmins();
        })
        .catch((err) => {});
    },
    // 多选列表项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 批量删除用户
    handleDelAdminIds() {
      let ids = this.multipleSelection.map((item) => item.adminId);
      removeAdminUserIds(ids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getAdmins();
        })
        .catch((err) => {});
    },
    // 关闭弹窗
    handleDialogClose() {
      this.adminForm = {
        adminId: null,
        username: "",
        password: "123456",
        roles: [],
        avatar: "",
      };
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getAdmins();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getAdmins();
    },
  },
};
</script>

<style lang="scss" scoped>
.roleTagClass {
  ::v-deep .el-form-item__content {
    display: flex;
    align-items: center;
    > * {
      margin-right: 15px;
    }
  }
}
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
