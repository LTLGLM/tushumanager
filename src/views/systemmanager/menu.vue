<template>
  <div>
    <el-card>
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="状态" prop="menuStatus">
          <el-select v-model="queryForm.menuStatus" placeholder="请选择状态">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="禁用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </Query>
      <el-button size="mini" type="primary" @click="addmenuM"
        >新增目录</el-button
      >
      <el-button size="mini" @click="showrow = !showrow">展开/折叠</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="menuId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="menuName" label="菜单名称" width="200">
        </el-table-column>
        <el-table-column prop="icon" label="图标" width="80" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.icon != '#'" class=""></i>
          </template>
        </el-table-column>
        <el-table-column
          prop="menuOrder"
          label="排序"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="perms" label="权限标识" align="center">
        </el-table-column>
        <el-table-column prop="path" label="组件路劲" align="center">
          <template slot-scope="scope">
            {{ scope.row.path === "#" ? "" : scope.row.path }}
          </template>
        </el-table-column>
        <el-table-column
          prop="menuStatus"
          label="状态"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.menuStatus === 0 ? "正常" : "停用" }}</el-tag>
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
              v-show="scope.row.menuType != 'F'"
              icon="el-icon-plus"
              size="mini"
              type="text"
              @click="addRow(scope.row)"
              >新增</el-button
            >
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
    </el-card>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="37%"
      @close="handleDialogClose"
      class="menuDialog"
    >
      <el-form
        :rules="menuFormRules"
        ref="menuFormRef"
        :model="menuForm"
        label-width="120px"
      >
        <el-form-item
          label="上级菜单"
          prop="pmenuName"
          v-if="menuForm.menuType != 'M'"
        >
          <el-input
            :disabled="true"
            v-model="menuForm.pmenuName"
            placeholder="请输入上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio label="M" :disabled="menuForm.menuType != 'M'"
              >目录</el-radio
            >
            <el-radio label="C" :disabled="menuForm.menuType != 'C'"
              >菜单</el-radio
            >
            <el-radio label="F" :disabled="menuForm.menuType != 'F'"
              >按钮</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
      </el-form>
      <el-form
        :rules="menuFormRules"
        ref="menuFormRef"
        :model="menuForm"
        label-width="120px"
        :inline="true"
        class="demo-form-inline"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="显示顺序" prop="menuOrder" class="orderitem">
          <el-input-number
            v-model="menuForm.menuOrder"
            :min="1"
            label="请输入显示顺序"
          ></el-input-number>
        </el-form-item>
        <el-form-item prop="path" v-if="menuForm.menuType == 'C'">
          <template #label>
            <el-tooltip
              class="item"
              effect="dark"
              :content="menupathTooltip"
              placement="left"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            路由地址
          </template>
          <el-input v-model="menuForm.path" placeholder="请输入路由地址" />
        </el-form-item>
        <el-form-item prop="component" v-if="menuForm.menuType != 'F'">
          <template #label>
            <el-tooltip
              class="item"
              effect="dark"
              :content="menucomponentTooltip"
              placement="left"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            组件路劲
          </template>
          <el-input v-model="menuForm.component" placeholder="请输入组件路劲" />
        </el-form-item>
        <el-form-item prop="perms" v-if="menuForm.menuType != 'M'">
          <template #label>
            <el-tooltip
              class="item"
              effect="dark"
              :content="menupermsTooltip"
              placement="left"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
            权限字符
          </template>
          <el-input v-model="menuForm.perms" placeholder="请输入角色权限字符" />
        </el-form-item>
        <el-form-item label="菜单状态" prop="menuStatus">
          <el-radio-group v-model="menuForm.menuStatus">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
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
import { addMenu, getMenuList, removeMenuIds, updateMenu } from "@/api/menu";
import { mapMutations } from "vuex";

export default {
  data() {
    return {
      // 是否展开行
      showrow: false,
      title: "",
      dialogVisible: false,
      queryForm: {
        menuName: "",
        menuStatus: null,
      },
      // 未处理的菜单数据
      menuListData: [],
      tableData: [],
      menuForm: {
        menuId: null,
        pid: null,
        menuName: "",
        icon: "",
        menuOrder: null,
        path: "",
        menuStatus: 0,
        menuType: null,
        component: null,
        path: null,
        perms: null,
        pmenuName: null,
      },
      menuFormRules: {
        menuName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        menuOrder: [
          { required: true, message: "显示顺序不能为空", trigger: "blur" },
          { type: "number", message: "显示顺序必须为数字", trigger: "blur" },
        ],
        component: [
          { required: true, message: "组件路劲不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^\/([a-zA-Z0-9-]+\/)*[a-zA-Z0-9-]+$/,
            message: "组件路劲格式不正确",
            trigger: "blur",
          },
        ],
        path: [
          { required: true, message: "路由地址不能为空", trigger: "blur" },
          {
            pattern: /^\/([a-zA-Z0-9-]+\/)*[a-zA-Z0-9-]+$/,
            message: "路由地址格式不正确",
            trigger: "blur",
          },
        ],
        perms: [
          { required: true, message: "权限字符不能为空", trigger: "blur" },
          {
            required: true,
            pattern: /^([a-zA-Z0-9-]+:)*[a-zA-Z0-9-]+$/,
            message: "权限字符格式不正确",
            trigger: "blur",
          },
        ],
        menuType: [
          { required: true, message: "菜单类型不能为空", trigger: "change" },
        ],
      },
      menucomponentTooltip: "",
      menupathTooltip: "",
      menupermsTooltip: "",
    };
  },
  watch: {
    showrow(newValue) {
      // 展开和关闭所有行
      this.tableData.forEach((row) => {
        this.$refs.tableRef.toggleRowExpansion(row, newValue);
      });
    },
  },
  mounted() {
    this.getMenus();
  },
  methods: {
    ...mapMutations(["SET_ROLES"]),
    // 将后端返回数据处理成tree结构
    formatTreeNode(menuData) {
      let treeData = {};
      // 用于存储各父目录下的子菜单的id
      let treeMenuid_Pid = {};
      menuData.forEach((element) => {
        // 是主目录
        if (element.pid == 0 && element.menuType == "M") {
          treeData[element.menuId] = element;
          treeData[element.menuId].children = {};
        } else if (element.pid != 0 && element.menuType == "C") {
          // 菜单
          treeData[element.pid]["children"][element.menuId] = element;
          treeMenuid_Pid[element.menuId] = element.pid;
        } else {
          let p_pid = treeMenuid_Pid[element.pid];
          // 按钮
          if (!treeData[p_pid]["children"][element.pid].children) {
            treeData[p_pid]["children"][element.pid].children = [];
          }
          treeData[p_pid]["children"][element.pid].children.push(element);
        }
      });
      let formatTreeData = Object.keys(treeData)
        .map((item) => {
          if (treeData[item].children) {
            treeData[item].children = Object.values(treeData[item].children)
              .map((it) => {
                if (it.children) {
                  it.children = it.children.sort(
                    (a, b) => a.menuOrder - b.menuOrder
                  );
                }

                return it;
              })
              .sort((a, b) => {
                a.menuOrder - b.menuOrder;
              });
          }
          return treeData[item];
        })
        .sort((a, b) => a.menuOrder - b.menuOrder);
      return formatTreeData;
    },
    // 获取菜单列表并转换成tree结构
    getMenus() {
      getMenuList()
        .then((res) => {
          this.menuListData = res.data;
          this.tableData = this.formatTreeNode(res.data);
        })
        .catch((err) => {});
    },
    Search() {
      // 单独发送请求然后根据现有总数据进行过滤
      getMenuList(this.queryForm)
        .then((res) => {
          let menuIdSet = new Set();
          res.data.forEach((element) => {
            menuIdSet.add(element.pid);
            menuIdSet.add(element.menuId);
          });
          console.log(menuIdSet);

          let queryMenuItem = this.menuListData.filter((menuItem) => {
            return menuIdSet.has(menuItem.menuId);
          });

          this.tableData = this.formatTreeNode(queryMenuItem);
          this.showrow = true;
        })
        .catch((err) => {});
    },
    // 重置搜索表单
    Refresh() {
      this.getMenus();
    },
    // 新增目录
    addmenuM() {
      this.title = "添加目录";
      this.menuForm.menuType = "M";
      this.menuForm.pid = 0;
      this.dialogVisible = true;
      this.menucomponentTooltip = "/组件地址";
    },
    addRow(row) {
      // 如果点击的是目录的添加，则添加菜单
      if (row.menuType == "M") {
        this.title = "添加菜单";
        this.menuForm.pmenuName = row.menuName;
        this.menuForm.menuType = "C";
        this.menucomponentTooltip =
          "/上级组件地址/菜单地址 例如/usermanager/vipuser";
        this.menupathTooltip = "确保和组件路劲一致";
        this.menupermsTooltip = "格式 上级组件地址:菜单地址:view";
      } else {
        // 添加按钮
        this.title = "添加按钮";
        this.menuForm.pmenuName = row.menuName;
        this.menuForm.menuType = "F";
        this.menupermsTooltip = `格式 上级组件地址:菜单地址:操作名称
        例如 usermanager:vipuser:add
        `;
      }
      this.menuForm.pid = row.menuId;
      this.dialogVisible = true;
    },
    editRow(row) {
      if (row.menuType == "M") {
        this.title = "编辑目录";
        this.menucomponentTooltip = "/组件地址";
      } else if (row.menuType == "C") {
        this.title = "编辑菜单";
        this.menucomponentTooltip =
          "/上级组件地址/菜单地址 例如/usermanager/vipuser";
        this.menupathTooltip = "确保和组件路劲一致";
        this.menupermsTooltip = "格式 上级组件地址:菜单地址:view";
      } else {
        this.title = "编辑按钮";
        this.menupermsTooltip = `格式 上级组件地址:菜单地址:操作名称
        例如 usermanager:vipuser:add
        `;
      }

      this.menuForm = JSON.parse(JSON.stringify(row));
      if (row.menuType != "M") {
        let pidMenu = this.menuListData.filter(
          (fil) => fil.menuId == row.pid
        )[0];
        this.menuForm.pmenuName = pidMenu.menuName;
      }

      this.dialogVisible = true;
    },
    handleSubmit() {
      this.$refs.menuFormRef.validate(async (valid) => {
        if (valid) {
          console.log(this.menuForm);
          if (this.menuForm.menuId) {
            await updateMenu(this.menuForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: `${this.title}成功`,
                });
              })
              .catch((err) => {});
          } else {
            await addMenu(this.menuForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: `${this.title}成功`,
                });
              })
              .catch((err) => {});
          }
          this.SET_ROLES([]);
          this.getMenus();
          this.dialogVisible = false;
        }
      });
    },
    delRow(row) {
      let MenuIds = [];
      this.getMenuIds(MenuIds, row);
      removeMenuIds(MenuIds).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getMenus();
      });
    },
    // 递归获取菜单ID
    getMenuIds(MenuIds, menu) {
      MenuIds.push(menu.menuId);
      if (menu.children && menu.children.length > 0) {
        menu.children.forEach((child) => {
          console.log(child);

          this.getMenuIds(MenuIds, child);
        });
      }
    },
    handleDialogClose() {
      this.menuForm = {
        menuId: null,
        pid: null,
        menuName: "",
        icon: "",
        menuOrder: null,
        path: "",
        menuStatus: 0,
        menuType: null,
        component: null,
        path: null,
        perms: null,
      };
      this.menucomponentTooltip = "";
      this.menupathTooltip = "";
      this.menupermsTooltip = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-form {
    .el-form-item {
      ::v-deep .el-input {
        width: 100% !important;
      }
    }
  }
}
</style>
