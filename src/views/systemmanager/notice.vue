<template>
  <div>
    <el-card>
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input
            v-model="queryForm.noticeTitle"
            placeholder="请输入通知标题"
          />
        </el-form-item>
        <el-form-item label="操作人员" prop="createBy">
          <el-input v-model="queryForm.createBy" placeholder="请输入操作人员" />
        </el-form-item>
      </Query>
      <el-button
        size="mini"
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAddNotice"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        @click="handleDelNoticeIds"
        :disabled="multipleSelection.length === 0"
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
        <el-table-column
          prop="noticeId"
          label="序号"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column
          prop="noticeTitle"
          label="通知标题"
          width="120"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="lastLoginIp" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.noticeStatus === 0 ? 'success' : 'danger'"
              >{{ scope.row.noticeStatus === 0 ? "开启" : "关闭" }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column prop="username" label="创建者" align="center">
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
      width="50%"
      @close="handleDialogClose"
    >
      <el-form
        :rules="noticeFormRules"
        ref="noticeFormRef"
        :model="noticeForm"
        label-width="80px"
      >
        <el-form-item label="通知标题" prop="noticeTitle">
          <el-input
            v-model="noticeForm.noticeTitle"
            placeholder="请输入通知标题"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="noticeForm.noticeStatus">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">关闭</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="noticeContent">
          <Editor v-model="noticeForm.noticeContent" :min-height="192"></Editor>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  addNotice,
  getNoticeById,
  getNoticeList,
  removeNotice,
  removeNoticeIds,
  updateNotice,
} from "@/api/notice";
import Editor from "@/components/editor/editor.vue";

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      title: "",
      queryForm: {
        noticeTitle: "",
        createBy: "",
        pageNum: 1,
        pageSize: 5,
      },
      noticeForm: {
        noticeId: null,
        noticeTitle: "",
        noticeStatus: 0,
        noticeContent: "",
      },
      noticeFormRules: {
        noticeTitle: [
          { required: true, message: "请输入通知标题", trigger: "blur" },
        ],
        noticeContent: [
          { required: true, message: "请输入通知内容", trigger: "blur" },
        ],
      },
      total: 0,
      multipleSelection: [],
    };
  },
  mounted() {
    this.getNotices();
  },
  methods: {
    getNotices() {
      getNoticeList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    Search() {
      this.getNotices();
    },
    Refresh() {
      this.getNotices();
    },
    handleAddNotice() {
      this.title = "添加通知";
      this.dialogVisible = true;
    },

    handleDelNoticeIds() {
      let noticeIds = this.multipleSelection.map((item=>item.noticeId))
      removeNoticeIds(noticeIds).then((res) => {
        this.$message({
          type: "success",
          message: "批量删除成功",
        });
        this.getNotices();
      })
       .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    editRow(row) {
      this.title = "编辑通知";
      this.noticeForm = row;
      getNoticeById(row.noticeId)
        .then((res) => {
          this.noticeForm = res.data;
        })
        .catch((err) => {});
      this.dialogVisible = true;
    },
    handleSubmit() {
      this.$refs.noticeFormRef.validate(async (valid) => {
        if (!valid) {
          console.log("error submit!!");
          return false; // 验证失败，退出
        }

        if (this.noticeForm.noticeId) {
          // 编辑操作
          await updateNotice(this.noticeForm)
            .then(() => {
              this.$message({
                type: "success",
                message: "编辑成功",
              });
            })
            .catch(() => {});
        } else {
          // 新增操作
          await addNotice(this.noticeForm)
            .then(() => {
              this.$message({
                type: "success",
                message: "添加成功",
              });
            })
            .catch(() => {});
        }

        // 刷新列表和关闭对话框
        this.dialogVisible = false;
        this.getNotices();
      });
    },
    delRow(row) {
      removeNotice(row.noticeId).then((res) => {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.getNotices();
      })
      .catch(() => {});
    },

    handleDialogClose() {
      this.noticeForm = {
        noticeId: null,
        noticeTitle: "",
        noticeStatus: 0,
        noticeContent: "",
      };
      this.dialogVisible = false;
    },
    handleSizeChange(pageSize) {
      this.queryForm.pageSize = pageSize;
      this.getNotices();
    },
    handleCurrentChange(pageNum) {
      this.queryForm.pageNum = pageNum;
      this.getNotices();
    },
  },
};
</script>

<style lang="scss" scoped></style>
