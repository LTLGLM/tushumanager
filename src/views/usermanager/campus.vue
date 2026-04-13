<template>
    <div>
        <el-card shadow="hover">
            <el-button
                size="mini"
                type="primary"
                plain
                icon="el-icon-plus"
                @click="addCampus"
            >新增</el-button>
            <el-button
                size="mini"
                type="danger"
                plain
                icon="el-icon-delete"
                :disabled="!multipleSelection.length > 0"
                @click="handleDelCampusIds"
            >批量删除</el-button>
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
                    prop="campusId"
                    label="校区ID"
                    width="180"
                    align="center"
                >
                </el-table-column>
                <el-table-column prop="campusName" label="校区名称" align="center">
                </el-table-column>
                <el-table-column prop="campusImage" label="校区图片" align="center">
                    <template slot-scope="scope">
                        <img
                            :src="scope.row.campusImage"
                            style="width: 50px; height: 50px"
                        />
                    </template>
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
                                title="确定要删除该校区吗？"
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
            width="30%"
            @close="handleDialogClose"
        >
            <el-form
                :rules="campusFormRules"
                ref="campusFormRef"
                :model="campusForm"
                label-width="120px"
            >
                <el-form-item label="校区名称" prop="campusName">
                    <el-input
                        v-model="campusForm.campusName"
                        placeholder="请输入校区名称"
                    />
                </el-form-item>
                <el-form-item label="校区图片" prop="campusImage">
                    <el-upload
                        class="avatar-uploader"
                        :action="uploadUrl"
                        :headers="{ Token: getToken() }"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="handleBeforeUpload"
                    >
                        <img
                            v-if="campusForm.campusImage"
                            :src="campusForm.campusImage"
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
import { GET_SESSION_KEY } from "@/utils/sessionStorage";
import {
    addCampus,
    removeCampusById,
    removeCampusByIds,
    getCampusById,
    getCampusList,
    updateCampus,
} from "@/api/campus.js";

export default {
    data() {
        return {
            title: "",
            uploadUrl: process.env.VUE_APP_BASE_API + "/upload",
            tableData: [],
            dialogVisible: false,
            campusForm: {
                campusId: null,
                campusName: "",
                campusImage: "",
                createTime: null,
            },
            multipleSelection: [],
            campusFormRules: {
                campusName: [
                    { required: true, message: "请输入校区名称", trigger: "blur" },
                    {
                        min: 2,
                        max: 20,
                        message: "校区名称长度在 2 到 20 个字符",
                        trigger: "blur",
                    },
                ],
                campusImage: [
                    { required: true, message: "请上传校区图片", trigger: "change" },
                ],
            },
        };
    },
    mounted() {
        this.getCampusList();
    },
    methods: {
        getToken() {
            return GET_SESSION_KEY("Token");
        },
        getCampusList() {
            getCampusList()
                .then((res) => {
                    if (res.code === 200) {
                        this.tableData = res.data;
                    }
                })
                .catch((err) => {});
        },
        addCampus() {
            this.title = "添加校区";
            this.dialogVisible = true;
        },
        editRow(row) {
            this.title = "编辑校区";
            getCampusById(row.campusId)
                .then((res) => {
                    if (res.code === 200) {
                        this.campusForm = res.data;
                    }
                })
                .catch((err) => {});
            this.dialogVisible = true;
        },
        handleAvatarSuccess(response, file, fileList) {
            this.campusForm.campusImage = process.env.VUE_APP_BASE_API + response.data;
        },
        handleBeforeUpload(file) {
            const type = ["image/jpeg", "image/jpg", "image/png", "image/svg"];
            const isJPG = type.includes(file.type);
            if (!isJPG) {
                this.$message.error(`图片格式错误!`);
                return false;
            }
            const isLt = file.size / 1024 / 1024 < 5;
            if (!isLt) {
                this.$message.error("上传图片大小不能超过 5MB!");
                return false;
            }
            return true;
        },
        handleSubmit() {
            this.$refs.campusFormRef.validate(async (valid) => {
                if (valid) {
                    if (this.campusForm.campusId) {
                        await updateCampus(this.campusForm)
                            .then((res) => {
                                if (res.code === 200) {
                                    this.$message.success(res.message);
                                }
                            })
                            .catch((err) => {});
                    } else {
                        await addCampus(this.campusForm)
                            .then((res) => {
                                if (res.code === 200) {
                                    this.$message.success(res.message);
                                }
                            })
                            .catch((err) => {});
                    }
                    this.getCampusList();
                    this.dialogVisible = false;
                }
            });
        },
        delRow(row) {
            removeCampusById(row.campusId)
                .then((res) => {
                    if (res.code === 200) {
                        this.$message.success(res.message);
                        this.getCampusList();
                    }
                })
                .catch((err) => {});
        },
        handleDelCampusIds() {
            let campusIds = this.multipleSelection.map((item) => item.campusId);
            removeCampusByIds(campusIds)
                .then((res) => {
                    if (res.code === 200) {
                        this.$message.success(res.message);
                        this.getCampusList();
                    }
                })
                .catch((err) => {});
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleDialogClose() {
            this.campusForm = {
                campusId: null,
                campusName: "",
                campusImage: "",
                createTime: null,
            };
            this.dialogVisible = false;
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
</style>