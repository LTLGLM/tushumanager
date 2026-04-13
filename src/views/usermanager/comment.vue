<template>
  <div class="comment-manager">
    <!-- 顶部搜索栏 -->
    <Query
      :queryForm="queryForm"
      @onSearch="handleSearch"
      @onRefresh="handleRefresh"
    >
      <el-form-item label="商品名称" prop="goodName">
        <el-input
          v-model="queryForm.goodName"
          placeholder="请输入商品名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="买家昵称" prop="nickname">
        <el-input
          v-model="queryForm.nickname"
          placeholder="请输入买家昵称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="回复状态" prop="isReplied">
        <el-select
          v-model="queryForm.isReplied"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option label="全部" :value="null" />
          <el-option label="已回复" :value="true" />
          <el-option label="未回复" :value="false" />
        </el-select>
      </el-form-item>
    </Query>

    <!-- 数据表格 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      border
      style="width: 100%; margin-top: 20px"
    >
      <el-table-column prop="commentId" label="ID" width="80" align="center" />
      
      <el-table-column label="商品信息" min-width="200">
        <template slot-scope="scope">
          <div class="good-info">
            <el-image
              style="width: 50px; height: 50px; border-radius: 4px"
              :src="scope.row.goodImage"
              :preview-src-list="[scope.row.goodImage]"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <span class="good-name">{{ scope.row.goodName }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="nickname" label="买家昵称" width="120" align="center" />

      <el-table-column label="提问内容" min-width="200">
        <template slot-scope="scope">
          <el-popover
            v-if="scope.row.content && scope.row.content.length > 20"
            placement="top-start"
            title="完整内容"
            width="300"
            trigger="hover"
            :content="scope.row.content"
          >
            <span slot="reference" class="content-text">{{ scope.row.content }}</span>
          </el-popover>
          <span v-else>{{ scope.row.content }}</span>
        </template>
      </el-table-column>

      <el-table-column label="提问时间" width="160" align="center">
        <template slot-scope="scope">
          {{ formatTime(scope.row.createTime) }}
        </template>
      </el-table-column>

      <el-table-column label="卖家回复" min-width="200">
        <template slot-scope="scope">
          <span v-if="scope.row.replyContent">{{ scope.row.replyContent }}</span>
          <span v-else style="color: #909399">暂无回复</span>
        </template>
      </el-table-column>

      <el-table-column label="回复时间" width="160" align="center">
        <template slot-scope="scope">
          {{ formatTime(scope.row.replyTime) }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="180" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除评论</el-button>
          <el-button
            v-if="scope.row.replyContent"
            size="mini"
            type="warning"
            icon="el-icon-remove-outline"
            @click="handleBlockReply(scope.row)"
            style="margin-left: 10px; margin-top: 5px;" 
          >屏蔽回复</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageParams.page"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="pageParams.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
import Query from '@/components/query/query.vue'
import { getCommentList, removeComment, removeReply } from '@/api/comment'
import { formatDate } from '@/utils/formatDate'

export default {
  name: 'CommentManager',
  components: {
    Query
  },
  data() {
    return {
      // 查询参数
      queryForm: {
        goodName: '',
        nickname: '',
        isReplied: null
      },
      // 分页参数
      pageParams: {
        page: 1,
        limit: 10
      },
      loading: false,
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList() {
      this.loading = true
      try {
        const params = {
          ...this.queryForm,
          pageNum: this.pageParams.page,
          pageSize: this.pageParams.limit
        }
        // 处理 isReplied 为 null 的情况，不传给后端或者传空字符串，视后端实现而定
        // 这里假设后端如果不传则查全部
        if (params.isReplied === null) delete params.isReplied

        const res = await getCommentList(params)
        if (res.code === 200) {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      } catch (error) {
        console.error('获取评论列表失败', error)
      } finally {
        this.loading = false
      }
    },
    
    // 搜索
    handleSearch() {
      this.pageParams.page = 1
      this.getList()
    },

    // 重置
    handleRefresh() {
      this.queryForm = {
        goodName: '',
        nickname: '',
        isReplied: null
      }
      this.pageParams.page = 1
      this.getList()
    },

    // 分页大小改变
    handleSizeChange(val) {
      this.pageParams.limit = val
      this.getList()
    },

    // 页码改变
    handleCurrentChange(val) {
      this.pageParams.page = val
      this.getList()
    },

    // 删除评论
    handleDelete(row) {
      this.$confirm('删除后，该评论及其对应的卖家回复将对用户不可见，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await removeComment([row.commentId])
          if (res.code === 200) {
            this.$message.success('删除成功')
            this.getList()
          }
        } catch (error) {
          console.error('删除失败', error)
        }
      }).catch(() => {})
    },

    // 屏蔽回复
    handleBlockReply(row) {
      this.$confirm('确认屏蔽该条回复内容吗？买家提问将保留。', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          const res = await removeReply(row.commentId)
          if (res.code === 200) {
            this.$message.success('屏蔽回复成功')
            this.getList()
          }
        } catch (error) {
          console.error('屏蔽回复失败', error)
        }
      }).catch(() => {})
    },

    // 格式化时间
    formatTime(time) {
      if (!time) return ''
      // 如果是时间戳
      // return formatDate('YYYY-mm-dd HH:MM:SS', new Date(time))
      // 如果后端直接返回格式化好的字符串，直接返回即可，或者再处理
      return time 
    }
  }
}
</script>

<style lang="scss" scoped>
.comment-manager {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  
  .good-info {
    display: flex;
    align-items: center;
    .good-name {
      margin-left: 10px;
      font-size: 14px;
      color: #606266;
      // 超过两行省略号
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .content-text {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    cursor: pointer;
  }

  .pagination-container {
    margin-top: 20px;
    text-align: right;
  }
}
</style>
