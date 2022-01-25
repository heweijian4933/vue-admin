<template>
  <div class="dept-view">
    <!-- 搜索查询模块 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryFormRef">
        <el-form-item prop="deptName" label="部门名称">
          <el-input v-model="queryForm.deptName" placeholder="请输入部门名称" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery"
            v-has:type="'dept-query'"
            >查询</el-button
          >
          <el-button type="danger" @click="handleReset('queryFormRef')"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <!-- /搜索查询模块 -->
    <!-- 主体tabel模块 -->
    <div class="base-table">
      <div class="action">
        <el-button
          type="primary"
          @click="handleAdd()"
          v-has:type="'dept-create'"
          >新增</el-button
        >
      </div>
      <el-table :data="deptList" row-key="_id">
        <!-- 实际上用v-bind="item"会更简洁 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
              size="small"
              v-has:type="'dept-update'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
              v-has:type="'dept-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页模块 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, jumper"
        :total="pager.total"
        :size="pager.pageSize"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- /主体tabel模块 -->

    <!-- 弹窗模块 - 新增/编辑弹框 -->
    <el-dialog
      v-model="showModal"
      title="编辑部门"
      center
      :before-close="handleClose"
    >
      <el-form
        :model="deptForm"
        ref="dialogFormRef"
        label-width="100px"
        :rules="deptRules"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="deptForm.parentId"
            :options="deptList"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'deptName',
            }"
            style="width: 100%"
            placeholder="不选择 则默认为最行政管理级"
          />
          <!-- <span>不选则直接创建一级菜单</span> -->
        </el-form-item>
        <el-form-item prop="deptName" label="部门名称">
          <el-input
            v-model="deptForm.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>

        <el-form-item prop="userName" label="负责人">
          <el-select
            v-model="deptForm.userName"
            placeholder="请选择负责人"
            @change="handleUserSelect"
          >
            <el-option
              v-for="item in userList"
              :key="item._id"
              :label="item.userName"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="mobile" label="负责人电话">
          <el-input
            v-model="deptForm.mobile"
            placeholder="负责人电话"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item prop="userEmail" label="负责人邮箱">
          <el-input
            v-model="deptForm.userEmail"
            placeholder="负责人邮箱"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel('dialogFormRef')">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- /弹窗模块 - 新增/编辑弹框 -->
  </div>
</template>
<script>
import { ElMessageBox } from "element-plus";
import util from "@/utils/util.js";
export default {
  name: "Dept",
  data() {
    return {
      queryForm: { deptName: "" },
      deptList: [],
      showModal: false,
      action: "add",
      deptForm: {
        parentId: [null],
      },
      userList: [],
      pager: { total: 0, pageSize: 10, pageNum: 1 },
      columns: [
        {
          label: "部门名称",
          prop: "deptName",
          width: 280,
        },
        {
          label: "负责人",
          prop: "userName",
        },
        {
          label: "建立时间",
          prop: "createTime",
          formatter(row, colume, cellValue, index) {
            return cellValue ? util.dateFmt(new Date(cellValue)) : null;
          },
        },
        {
          label: "更新时间",
          prop: "updateTime",
          formatter(row, colume, cellValue, index) {
            return cellValue ? util.dateFmt(new Date(cellValue)) : null;
          },
        },
      ],
      deptRules: {
        deptName: [
          {
            required: true,
            message: "请输入部门名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 20,
            message: "长度在2-18个字符",
            trigger: "blur",
          },
        ],
        parentId: [
          {
            required: true,
            message: "请选择上级部门",
            trigger: "blur",
          },
        ],
        userId: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getDeptTreeList();
    this.getUserAllList();
  },
  watch: {
    "queryForm.deptName"(newVal, oldVal) {
      if (!newVal) this.getDeptTreeList();
    },
  },
  methods: {
    // 获取部门列表
    async getDeptTreeList() {
      try {
        const params = { ...this.queryForm, ...this.pager };
        const { list } = await this.$api.getDeptTreeList(params);
        this.deptList = list;
      } catch (err) {
        throw new Error(err);
      }
    },
    // 获取菜单列表
    async getUserAllList() {
      try {
        let { list } = await this.$api.getUserAllList();
        this.userList = list;
      } catch (err) {
        throw new Error(err);
      }
    },
    // 选择负责人
    handleUserSelect(userId) {
      console.log(userId);
      let selectedUser = this.userList.find((item) => item.userId === userId);
      if (selectedUser) {
        this.deptForm.userId = userId;
        this.deptForm.mobile = selectedUser.mobile;
        this.deptForm.userEmail = selectedUser.userEmail;
      }
    },
    // 查询部门列表
    handleQuery() {
      this.getDeptTreeList();
    },
    // 表单重置
    handleReset(form) {
      const ref = this.$refs[form];
      if (ref) ref.resetFields();
    },
    // 增加部门
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
    },
    // 删除部门
    async handleDel(_id) {
      await this.$api.deptDel({ _id });
      this.$message.success("删除成功");
      this.getDeptTreeList();
    },
    // 编辑部门
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      // let { parentId, _id } = row;
      // parentId = [...parentId, _id].filter((item) => item);
      this.$nextTick(() => {
        // nextTick保证后续reset能够正常清空
        // this.deptForm = row;
        Object.assign(this.deptForm, { ...row });
      });
    },
    // 提交 弹框操作
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          let { action, deptForm } = this;
          let res;
          if (action === "add") {
            res = await this.$api.deptCreate(deptForm);
          } else if (action === "edit") {
            res = await this.$api.deptUpdate(deptForm);
          }

          if (res && res.affectedDocs > 0) {
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogFormRef");
            this.getDeptTreeList();
          } else {
            this.$message.error("操作失败,请重试");
          }
        }
      });
    },
    // 取消 弹框操作
    handleCancel(formRef) {
      this.showModal = false;
      this.handleReset(formRef);
    },
    // 用于用户点击到遮罩时候重置弹框
    handleClose(done) {
      this.handleCancel("dialogFormRef");
      done();
    },
    //分页
    handleCurrentChange(current) {
      this.pager.pageNum = current;
      this.getDeptTreeList();
    },
  },
};
</script>
<style lang="scss"></style>
