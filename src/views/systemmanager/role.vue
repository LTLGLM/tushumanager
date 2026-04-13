<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="权限字符" prop="roleKey">
          <el-input v-model="queryForm.roleKey" placeholder="请输入权限字符" />
        </el-form-item>
        <el-form-item label="状态" prop="roleStatus">
          <el-select v-model="queryForm.roleStatus" placeholder="请选择状态">
            <el-option label="启用" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间" prop="date">
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
        @click="handleAddRole"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        @click="handleDelRoleIds"
        :disabled="multipleSelection.length === 0"
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
          prop="roleId"
          label="角色编号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="roleKey"
          label="权限字符"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.roleStatus"
              :active-value="0"
              :inactive-value="1"
              @change="handleStatusChange($event, scope.row)"
            >
            </el-switch>
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
              plain
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
            <el-button
              icon="el-icon-menu"
              size="mini"
              type="text"
              plain
              @click="editAuth(scope.row)"
            >
              分配权限
            </el-button>
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
        :rules="roleFormRules"
        ref="roleFormRef"
        :model="roleForm"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色权限字符" prop="roleKey">
          <el-input
            v-model="roleForm.roleKey"
            placeholder="请输入角色权限字符"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配权限"
      :visible.sync="editAuthVisible"
      width="30%"
      @close="handleEditAuthDialogClose"
    >
      <el-form ref="AuthMenuFormRef" :model="AuthMenuForm" label-width="120px">
        <el-form-item label="角色" prop="roleName">
          <el-input
            v-model="AuthMenuForm.roleName"
            placeholder="请选择角色"
            disabled
          />
        </el-form-item>
        <el-form-item label="分配菜单权限"
          ><el-tree
            ref="eltreeRef"
            :data="menuTree"
            show-checkbox
            node-key="menuId"
            :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys"
            :props="defaultProps"
          >
          </el-tree
        ></el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAuthVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleMenuSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getMenuTree } from "@/api/menu";
import {
  addRole,
  getRoleById,
  getRoleList,
  getRoleMenus,
  removeRole,
  removeRoleIds,
  updateRole,
  updateRoleMenu,
} from "@/api/role";

export default {
  data() {
    return {
      // 选择的时间
      selectDate: [],
      tableData: [],
      // 添加和修改角色弹窗
      dialogVisible: false,
      // 弹窗标题
      title: "",
      //   查询会员表单
      queryForm: {
        roleName: "",
        roleKey: "",
        roleStatus: null,
        starttime: null,
        endtime: null,
        pageSize: 5,
        pageNum: 1,
      },
      //
      roleForm: {
        roleId: null,
        roleName: "",
        roleKey: "",
      },
      // 添加角色表单验证
      roleFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "请输入角色标识符", trigger: "blur" },
        ],
      },
      // 批量操作数据
      multipleSelection: [],
      total: 0,
      // 全部权限菜单的树结构
      menuTree: [],
      // 分配权限弹窗
      editAuthVisible: false,
      AuthMenuForm: {
        roleId: null,
        roleName: "",
      },
      // 默认展开节点的数组
      defaultExpandedKeys: [],
      // 默认选中节点的数组
      defaultCheckedKeys: [],
      // 树形结构字段
      defaultProps: {
        children: "children",
        label: "menuName",
      },
    };
  },
  created() {
    this.getMenuTree();
  },
  mounted() {
    this.getRoles();
  },
  methods: {
    // 获取角色列表
    getRoles() {
      getRoleList(this.queryForm)
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
    // 搜索
    Search() {
      this.getRoles();
    },
    // 重置搜索表单
    Refresh() {
      this.selectDate = [];
      this.queryForm.starttime = null;
      this.queryForm.endtime = null;
      this.getRoles();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击新增角色
    handleAddRole() {
      this.title = "添加角色";
      this.dialogVisible = true;
    },
    // 编辑角色
    editRow(row) {
      this.title = "编辑角色";
      this.roleForm = row;
      getRoleById(row.roleId)
        .then((res) => {
          this.roleForm = res.data;
        })
        .catch((err) => {});
      this.dialogVisible = true;
    },
    // 修改状态
    handleStatusChange($event, row) {
      updateRole(row)
        .then((res) => {
          this.$message({
            message: "修改角色状态成功",
            type: "success",
          });
        })
        .catch((err) => {});
    },
    // 提交添加和修改角色
    handleSubmit() {},
    // 提交添加和修改角色
    handleSubmit() {
      // 验证表单
      this.$refs.roleFormRef.validate(async (valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false; // 验证失败，退出
        }
        // 验证通过后，根据 title 判断是添加还是修改
        if (!this.roleForm.roleId) {
          await addRole(this.roleForm)
            .then((res) => {
              this.$message({
                type: "success",
                message: "添加角色成功",
              });
            })
            .catch((err) => {});
        } else {
          // 修改角色代码
          await updateRole(this.roleForm)
            .then((res) => {
              this.$message({
                type: "success",
                message: "修改角色成功",
              });
            })
            .catch((err) => {});
        }

        // 关闭对话框
        this.dialogVisible = false;
        this.getRoles(); // 刷新角色列表
      });
    },

    // 关闭弹窗
    handleDialogClose() {
      // 清空表单
      this.roleForm = {
        roleId: null,
        roleName: "",
        roleKey: "",
      };
    },
    // 删除角色
    delRow(row) {
      let roleId = row.roleId;
      removeRole(roleId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除角色成功",
          });
          this.getRoles();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelRoleIds() {
      let roleids = this.multipleSelection.map((item) => item.roleId);
      removeRoleIds(roleids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getRoles();
        })
        .catch((err) => {});
    },
    // 获取全部权限
    getMenuTree() {
      getMenuTree()
        .then((res) => {
          this.menuTree = res.data;
        })
        .catch((err) => {});
    },
    // 讲权限数据处理成
    // 点击分配权限弹窗
    editAuth(row) {
      this.AuthMenuForm.roleId = row.roleId;
      this.AuthMenuForm.roleName = row.roleName;
      // 获取角色权限
      getRoleMenus(row.roleId)
        .then((res) => {
          if (res.data) {
            let checkArr = this.foreachTreeData([], res.data);
            console.log(checkArr);

            this.defaultCheckedKeys = checkArr;
            this.defaultExpandedKeys = checkArr;
          }
        })
        .catch((err) => {});
      this.editAuthVisible = true;
    },
    // 遍历树形结构处理
    foreachTreeData(newArr, treeData) {
      treeData.forEach((item) => {
        if (item.children.length == 0 || item.menuType == "F") {
          newArr.push(item.menuId);
        }
        if (item.children && item.children.length > 0) {
          this.foreachTreeData(newArr, item.children);
        }
      });
      return newArr;
    },
    handleMenuSubmit() {
      let menuIds = [
        ...this.$refs.eltreeRef.getCheckedKeys(),
        ...this.$refs.eltreeRef.getHalfCheckedKeys(),
      ];

      updateRoleMenu(this.AuthMenuForm.roleId, menuIds)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "分配权限成功",
            });
          }
        })
        .catch();
      this.editAuthVisible = false;
    },
    handleEditAuthDialogClose() {
      this.AuthMenuForm.roleId = null;
      this.AuthMenuForm.roleName = "";
      this.defaultCheckedKeys = [];
      this.defaultExpandedKeys = [];
      this.$refs.eltreeRef.setCheckedKeys([]);
      this.editAuthVisible = false;
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getRoles();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getRoles();
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tree {
  margin-top: 10px;
  overflow: auto;
  height: 300px;
}
</style>
