<template>
  <div>
    <el-card shadow="hover">
      <Query :queryForm="queryForm" @onSearch="Search" @onRefresh="Refresh">
        <el-form-item label="商品分类" prop="cateId">
          <el-cascader
            v-model="selectedCateIds"
            :options="selectcateList"
            :props="{
              checkStrictly: true,
              label: 'cateName',
              value: 'cateId',
              children: 'children',
            }"
            @change="selectcateChange"
            clearable
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="商品搜索" prop="goodName">
          <el-input v-model="queryForm.goodName" placeholder="请输入商品名称" />
        </el-form-item>
        <el-form-item label="用户商品" prop="username">
          <el-input v-model="queryForm.username" placeholder="请输入用户名称" />
        </el-form-item>
      </Query>
      <el-button
        size="mini"
        type="primary"
        plain
        icon="el-icon-plus"
        @click="handleAddGood"
        >新增</el-button
      >
      <el-button
        size="mini"
        type="danger"
        plain
        icon="el-icon-delete"
        :disabled="!multipleSelection.length > 0"
        @click="handleDelGoodIds"
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
        <el-table-column prop="goodId" label="商品ID" align="center">
        </el-table-column>
        <el-table-column prop="goodName" label="商品名称" align="center">
        </el-table-column>
        <el-table-column prop="username" label="商品所属用户" align="center" width="200">
        </el-table-column>
        <el-table-column prop="merId" label="创建方式" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.merId === 1">自主添加</span>
            <span v-else>系统添加</span>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="商品图片" align="center">
          <template slot-scope="scope">
            <img
              :src="'/dev-api/' + scope.row.image"
              alt="商品图片"
              style="width: 50px; height: 50px"
            />
          </template>
        </el-table-column>
        <el-table-column prop="goodInfo" label="商品简介" align="center">
        </el-table-column>
        <el-table-column prop="keyword" label="关键词" align="center">
        </el-table-column>
        <el-table-column prop="isShow" label="状态" align="center" width="200">
          <template slot-scope="scope">
            <el-switch
              :active-value="true"
              :inactive-value="false"
              active-text="上架"
              inactive-text="下架"
              v-model="scope.row.isShow"
              @change="handleSwitchChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="cateName" label="所属分类" align="center">
        </el-table-column>
        <el-table-column prop="price" label="商品价格" align="center">
        </el-table-column>
        <el-table-column prop="stock" label="库存" align="center">
        </el-table-column>
        <el-table-column prop="browse" label="浏览量" align="center">
        </el-table-column>
        <el-table-column prop="addTime" label="创建时间" align="center">
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
      :title="title"
      :visible.sync="dialogVisible"
      @close="handleDialogClose"
      width="40%"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="first">
          <el-form
            :rules="goodFormRules"
            ref="goodFormRef"
            :model="goodForm"
            label-width="120px"
          >
            <el-form-item label="所属用户" prop="username">
              <el-select
                v-model="goodForm.username"
                :filterable="true"
                placeholder="请选择所属用户"
                :filter-method="SelectQuery"
                @change="changeSelectAdmin"
              >
                <el-option
                  v-for="item in adminSelectData"
                  :key="item.adminId"
                  :label="item.username"
                  :value="item.adminId + '_' + item.username"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商品图片" prop="image">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="{ Token: getToken() }"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="handleBeforeUpload"
              >
                <img
                  v-if="goodForm.image"
                  :src="'/dev-api/' + goodForm.image"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodName">
              <el-input
                v-model="goodForm.goodName"
                placeholder="请输入商品名称"
              />
            </el-form-item>
            <el-form-item label="商品简介" prop="goodInfo">
              <el-input
                v-model="goodForm.goodInfo"
                placeholder="请输入商品简介"
              />
            </el-form-item>
            <el-form-item label="所属分类" prop="cateId">
              <el-cascader
                v-model="goodCateIds"
                :options="selectcateList"
                :props="{
                  checkStrictly: true,
                  label: 'cateName',
                  value: 'cateId',
                  children: 'children',
                }"
                @change="goodCateChange"
                clearable
              >
              </el-cascader>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="goodForm.price" placeholder="请输入商品价格" />
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="second">
          <el-form
            :rules="goodFormRules"
            ref="goodFormRef"
            :model="goodForm"
            label-width="120px"
          >
            <el-form-item label="关键词" prop="keyword">
              <el-input
                v-model="goodForm.keyword"
                placeholder="示例：手机，小米"
              />
            </el-form-item>
            <el-form-item label="轮播图" prop="sliderImage" class="sliderForm">
              <el-upload
                list-type="picture-card"
                class="slider-uploader"
                :action="uploadUrl"
                :headers="{ Token: getToken() }"
                :on-success="handlesliderSuccess"
                :before-upload="handleBeforeUpload"
                :file-list="fileList"
              >
                <i class="el-icon-plus slider-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="商品单位" prop="unitName">
              <el-input
                v-model="goodForm.unitName"
                placeholder="请输入商品单位"
              />
            </el-form-item>

            <el-form-item label="商品排序" prop="sort">
              <el-input v-model="goodForm.sort" placeholder="请输入商品排序" />
            </el-form-item>

            <el-form-item label="商品库存" prop="stock">
              <el-input v-model="goodForm.stock" placeholder="请输入商品库存" />
            </el-form-item>

            <el-form-item label="是否包邮" prop="isPostage">
              <el-radio-group v-model="goodForm.isPostage">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="商品跑腿费"
              prop="postage"
              v-if="goodForm.isPostage === 1"
            >
              <el-input
                type="number"
                min="0"
                v-model="goodForm.postage"
                placeholder="请输入商品跑腿费"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAdminByAdmin } from "@/api/admin";
import {
  getGoodById,
  updateGood,
  addGood,
  getGoodList,
  removeGood,
  removeGoods,
  updateGoodStatus,
} from "@/api/good";
import { GET_SESSION_KEY } from "@/utils/sessionStorage";
import { mapActions, mapGetters, mapMutations } from "vuex";

export default {
  data() {
    return {
      activeName: "first",
      uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
      title: "",
      selectedCateIds: [],
      dialogVisible: false,
      floorData: [],
      tableData: [],
      multipleSelection: [],
      //   查询地址表单
      queryForm: {
        firstCateId: null,
        secondCateId: null,
        username: "",
        goodName: "",
      },
      adminSelectData: [],
      goodCateIds: [],
      goodForm: {
        goodId: null,
        userId: null,
        merId: 0,
        image: "",
        goodName: "",
        sliderImage: "",
        goodInfo: "",
        keyword: "",
        cateId: "",
        price: "",
        origialPrice: "",
        postage: "",
        unitName: "",
        sort: "",
        stock: "",
        isShow: 0,
        isPostage: "",
        username: "",
      },
      total: 0,
      goodFormRules: {
        username: [
          { required: true, message: "请选择所属用户", trigger: "blur" },
        ],
        goodInfo: [
          { required: true, message: "请输入商品简介", trigger: "blur" },
        ],
        cateId: [
          { required: true, message: "请选择所属分类", trigger: "change" },
        ],
        goodName: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        price: [{ required: true, message: "请输入商品价格", trigger: "blur" }],
        keyword: [{ required: true, message: "请输入关键词", trigger: "blur" }],
        postage: [
          { required: true, message: "请输入商品跑腿费", trigger: "blur" },
        ],
        unitName: [
          { required: true, message: "请输入商品单位", trigger: "blur" },
        ],
        sort: [{ required: true, message: "请输入商品排序", trigger: "blur" }],
        stock: [{ required: true, message: "请输入商品库存", trigger: "blur" }],
        isPostage: [
          { required: true, message: "请选择是否包邮", trigger: "blur" },
        ],
      },
      // 搜索用户防抖函数
      DebouncemSelectUserHandle: null,
      // 上下架防抖函数
      DebouncemGoodStatusHandle: null,
      // 轮播图照片墙
      fileList: [],
    };
  },
  watch: {
    // 切换是否包邮清空跑腿费
    "goodForm.isPostage": {
      handler(newVal) {
        console.log(newVal);
        if (newVal) {
          this.goodForm.postage = "";
        }
      },
    },
  },
  computed: {
    ...mapGetters(["selectcateList"]),
    // 轮播图列表计算属性
    sliberList() {
      return this.goodForm.sliderImage.split(",");
    },
  },
  created() {
    // 创建搜索用户防抖函数
    this.DebouncemSelectUserHandle = this.$Debounce(this.filterAdmin, 1000);
    // 创建商品上下架防抖函数
    this.DebouncemGoodStatusHandle = this.$Debounce(this.updateGoodstatus, 500);
  },
  mounted() {
    this.hasSelectCates();
    this.getGoods();
  },
  methods: {
    ...mapMutations(["SET_SELECTCATE_LIST"]),
    ...mapActions(["getCates"]),
    // 获取Token
    getToken() {
      return GET_SESSION_KEY("Token");
    },
    // 判断是否有分类数据
    async hasSelectCates() {
      if (!this.SET_SELECTCATE_LIST()) {
        await this.getCates().catch((err) => {});
      }
    },
    // 获取商品数据
    getGoods() {
      getGoodList(this.queryForm)
        .then((res) => {
          this.tableData = res.data.list;
          this.total = res.data.total;
        })
        .catch((err) => {});
    },
    // 选择分类数据
    selectcateChange(val) {
      [this.queryForm.firstCateId, this.queryForm.secondCateId = null] = val;
    },
    // 查询
    Search() {
      this.getGoods();
    },
    // 重置
    Refresh() {
      this.selectedCateIds = [];
      this.queryForm.firstCateId = null;
      this.queryForm.secondCateId = null;
      this.getGoods();
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
      this.goodForm.image = process.env.VUE_APP_BASE_API + response.data;
    },
    // 上传轮播图成功的回调函数
    handlesliderSuccess(response, file, fileList) {
      console.log(fileList);

      let imageUrlList = fileList.map((item) => {
        if (item.response) {
          return item.response.data;
        } else {
          return item.url.replace("/dev-api", "");
        }
      });
      let imageUrlString = imageUrlList.join(",");
      this.goodForm.sliderImage = imageUrlString;
    },

    // 所属用户搜索框
    SelectQuery(query) {
      if (String(query).trim().length <= 0) {
        this.filterAdmin({ query: "" });
      }
      const qy = {
        query,
      };
      this.DebouncemSelectUserHandle(qy);
    },
    filterAdmin(qy) {
      getAdminByAdmin(qy)
        .then((res) => {
          this.adminSelectData = res.data;
        })
        .catch((err) => {});
    },
    // 选择所属用户
    changeSelectAdmin(val) {
      let [adminId, username] = val.split("_");
      this.goodForm.userId = adminId;
      this.goodForm.username = username;
    },
    goodCateChange(val) {
      let [cateOneId, cateTwoId] = val;
      if (cateTwoId) {
        this.goodForm.cateId = cateTwoId;
      } else {
        this.goodForm.cateId = cateOneId;
      }
    },
    // 上下架商品处理事件
    handleSwitchChange(row) {
      this.DebouncemGoodStatusHandle(row);
    },
    // 上下架商品请求
    updateGoodstatus(good) {
      updateGoodStatus(good)
        .then((res) => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.getGoods();
        })
        .catch((err) => {});
    },
    // 添加商品
    handleAddGood() {
      this.title = "添加商品";
      this.filterAdmin({ query: "" });
      this.dialogVisible = true;
    },
    // 编辑商品
    handleEdit(row) {
      this.goodForm = row;
      getGoodById(row.goodId)
        .then((res) => {
          this.goodForm = res.data;
          this.goodCateIds = res.data.cateId;
          this.fileList = res.data.sliderImage.split(",").map((item) => {
            return {
              name: item.substring(item.lastIndexOf("/") + 1),
              url: process.env.VUE_APP_BASE_API + item,
            };
          });
        })
        .catch((err) => {});
      this.dialogVisible = true;
    },

    handleChange(val) {
      this.goodForm.floorId = val.split("_")[0];
    },
    handleSubmit() {
      this.$refs.goodFormRef.validate((valid) => {
        if (valid) {
          if (this.goodForm.goodId) {
            // 编辑数据
            updateGood(this.goodForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "编辑成功",
                });
              })
              .catch((err) => {});
          } else {
            // 新增数据
            addGood(this.goodForm)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "添加成功",
                });
              })
              .catch((err) => {});
          }
          // 关闭弹窗
          this.dialogVisible = false;
          // 重新获取数据
          this.getGoods();
        }
      });
    },
    handleDelete(row) {
      removeGood(row.goodId)
        .then((res) => {
          this.$message({
            type: "success",
            message: "删除成功",
          });
          // 重新获取数据
          this.getGoods();
        })
        .catch((err) => {});
    },
    // 点击批量删除
    handleDelGoodIds() {
      let goodids = this.multipleSelection.map((item) => item.goodId);
      removeGoods(goodids)
        .then((res) => {
          this.$message({
            type: "success",
            message: "批量删除成功",
          });
          this.getGoods();
        })
        .catch((err) => {});
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDialogClose() {
      this.fileList = [];
      this.$refs.goodFormRef.resetFields();
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
::v-deep .el-dialog {
  min-width: 750px;

  .el-form {
    .el-form-item__content {
      width: 200px;

      .el-input {
        width: 100%;
      }
    }

    .sliderForm {
      .el-form-item__content {
        width: 90%;

        .el-input {
          width: 100%;
        }

        .el-upload-list__item {
          height: 130px;
          width: 130px;
        }
      }
    }
  }

  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 130px;
    height: 130px;
  }

  .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }

  .avatar {
    width: 130px;
    height: 130px;
    display: block;
  }

  .slider-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 130px;
    height: 130px;
    line-height: 130px;
    text-align: center;
  }

  .slider {
    width: 130px;
    height: 130px;
    display: block;
  }

  .el-tag {
    margin-right: 10px;
  }
  .sliderList {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin-top: 20px;
  }
}
</style>
