<template>
  <div>
    <el-card>
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="queryForm.cateName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="状态" prop="cateStatus">
          <el-select v-model="queryForm.cateStatus" placeholder="请选择状态">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="停用" :value="1"></el-option>
          </el-select>
        </el-form-item>
      </Query>
      <el-button size="mini" type="primary" @click="addCategory"
        >新增分类</el-button
      >
      <el-button size="mini" @click="showrow = !showrow">展开/折叠</el-button>
    </el-card>
    <el-card style="margin-top: 10px">
      <el-table
        ref="tableRef"
        :data="tableData"
        style="width: 100%; margin-bottom: 20px"
        row-key="cateId"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column prop="cateName" label="分类名称" width="130">
        </el-table-column>
        <el-table-column
          prop="cateImage"
          label="分类图片"
          width="80"
          align="center"
        >
          <template slot-scope="scope">
            <img
              :src="scope.row.cateImage"
              alt="分类图片"
              style="width: 60px; height: 60px"
            />
          </template>
        </el-table-column>
        <el-table-column
          prop="cateOrder"
          label="排序"
          width="80"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="cateStatus"
          label="状态"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag>{{ scope.row.cateStatus === 0 ? "正常" : "停用" }}</el-tag>
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
              v-show="scope.row.catePid == 0"
              icon="el-icon-plus"
              size="mini"
              type="text"
              @click="addCategory(scope.row)"
              >新增</el-button
            >
            <el-button
              icon="el-icon-edit"
              size="mini"
              type="text"
              @click="editCategory(scope.row)"
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
    >
      <el-form
        :rules="cateFormRules"
        ref="cateFormRef"
        :model="cateForm"
        label-width="120px"
      >
        <el-form-item
          label="上级分类"
          prop="catePName"
          v-if="cateForm.catePName"
        >
          <el-input :disabled="true" v-model="cateForm.catePName" />
        </el-form-item>
        <el-form-item label="分类名称" prop="cateName">
          <el-input v-model="cateForm.cateName" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类图片" prop="cateImage">
          <el-upload
            class="avatar-uploader"
            :action="uploadUrl"
            :headers="{ Token: getToken() }"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="cateForm.cateImage"
              :src="cateForm.cateImage"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="显示顺序" prop="cateOrder">
          <el-input-number
            v-model="cateForm.cateOrder"
            :min="1"
            label="请输入显示顺序"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="分类状态" prop="cateStatus">
          <el-radio-group v-model="cateForm.cateStatus">
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
import {
  getCateList,
  getCateById,
  addCate,
  updateCate,
  removeCates,
} from "@/api/cate";
import { catehandle } from "@/utils/catehandle";
import { GET_SESSION_KEY } from "@/utils/sessionStorage";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
      // 是否展开行
      showrow: false,
      title: "",
      dialogVisible: false,
      queryForm: {
        cateName: "",
        cateStatus: null,
      },
      tableData: [],
      cateForm: {
        catePName: null,
        cateId: null,
        catePid: null,
        cateName: "",
        cateImage: "",
        cateStatus: 0,
        cateOrder: null,
      },
      cateFormRules: {
        cateName: [
          { required: true, message: "菜单名称不能为空", trigger: "blur" },
        ],
        cateOrder: [
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
        cateType: [
          { required: true, message: "菜单类型不能为空", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    showrow(newValue) {
      console.log(newValue);

      // 展开和关闭所有行
      this.tableData.forEach((row) => {
        this.$refs.tableRef.toggleRowExpansion(row, newValue);
      });
    },
    selectcateList(newValue) {
      this.tableData = newValue;
    },
  },
  computed: {
    ...mapGetters(["selectcateList"]),
  },
  mounted() {
    if (!this.selectcateList) {
      this.tableData = this.selectcateList;
    } else {
      this.getCates();
    }
  },
  methods: {
    ...mapMutations(["SET_SELECTCATE_LIST"]),
    ...mapActions(["getCates"]),

    getToken() {
      return GET_SESSION_KEY("Token");
    },
    Search() {
      // 单独发送请求然后根据现有总数据进行过滤
      getCateList(this.queryForm)
        .then((res) => {
          let cateIdSet = new Set();
          res.data.forEach((element) => {
            cateIdSet.add(element.cateId);
            cateIdSet.add(element.catePid);
          });

          let querycateItem = this.selectcateList.filter((cateItem) => {
            let childList = [];
            if (cateItem.children.length > 0) {
              childList = cateItem.children.map((child) =>
                cateIdSet.has(child.cateId)
              );
            }

            if (cateIdSet.has(cateItem.cateId)) {
              console.log(cateItem);

              return {
                children: childList,
                ...cateItem,
              };
            }
          });

          this.tableData = querycateItem;
          this.showrow = true;
        })
        .catch((err) => {});
    },
    // 重置搜索表单
    Refresh() {
      this.getCates();
      this.showrow = false;
    },
    // 根据父ID过滤出分类名
    cateNameFilter(cateId) {
      let filterCate = this.selectcateList.filter(
        (cate) => cate.cateId == cateId
      );
      return filterCate ? filterCate[0].cateName : null;
    },
    // 上传前校检格式和大小
    beforeAvatarUpload(file) {
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
      this.cateForm.cateImage = process.env.VUE_APP_BASE_API + response.data;
    },

    // 新增分类
    addCategory(row) {
      if (row instanceof PointerEvent) {
        this.title = "添加分类";
      } else {
        this.title = "添加子分类";
        this.cateForm.catePid = row.cateId;
        this.cateForm.catePName = this.cateNameFilter(row.cateId);
      }
      this.dialogVisible = true;
    },
    async editCategory(row) {
      this.cateForm = {
        ...row,
      };
      await getCateById(row.cateId).then((res) => {
        this.cateForm = res.data;
      });
      if (row.catePid) {
        this.title = "编辑子分类";
        this.cateForm.catePName = this.cateNameFilter(row.catePid);
      } else {
        this.title = "编辑分类";
      }
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.$refs.cateFormRef.validate(async (valid) => {
        if (valid) {
          if (this.cateForm.cateId) {
            await updateCate(this.cateForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: `${this.title}成功`,
                });
              })
              .catch((err) => {});
          } else {
            await addCate(this.cateForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: `${this.title}成功`,
                });
              })
              .catch((err) => {});
          }
          // this.SET_ROLES([]);
          this.getCates();
          this.dialogVisible = false;
        }
      });
    },
    delRow(row) {
      let cateIds = [];
      this.getcateIds(cateIds, row);
      removeCates(cateIds).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getCates();
      });
    },
    // 递归获取菜单ID
    getcateIds(cateIds, cate) {
      cateIds.push(cate.cateId);
      if (cate.children && cate.children.length > 0) {
        cate.children.forEach((child) => {
          this.getcateIds(cateIds, child);
        });
      }
    },
    handleDialogClose() {
      this.cateForm = {
        catePName: null,
        cateId: null,
        catePid: null,
        cateName: "",
        cateImage: "",
        cateStatus: 0,
        cateOrder: null,
      };
      this.cateFormRef.resetFields();
      this.dialogVisible = false;
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
  .avatar-uploader ::v-deep .el-upload {
    border: 1px dashed #ccc;
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
    width: 125px;
    height: 125px;
    line-height: 125px;
    text-align: center;
  }
  .avatar {
    width: 125px;
    height: 125px;
    display: block;
  }
}
</style>
