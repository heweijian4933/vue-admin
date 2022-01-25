<template>
  <div class="leave-view">
    <!-- 搜索查询模块 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryFormRef">
        <el-form-item prop="applyState" label="审批状态">
          <el-select v-model="queryForm.applyState">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批驳回"></el-option>
            <el-option :value="4" label="审批通过"></el-option>
            <el-option :value="5" label="审批作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery"
            v-has:type="'leave-query'"
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
          v-has:type="'leave-create'"
          >申请</el-button
        >
      </div>
      <el-table :data="leaveList">
        <!-- 实际上用v-bind="item"会更简洁 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="260">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
              size="small"
              >编辑</el-button
            >

            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
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
      title="编辑请假"
      center
      :before-close="handleClose"
    >
      <el-form
        :model="leaveForm"
        ref="dialogFormRef"
        label-width="100px"
        :rules="leaveRules"
      >
        <el-form-item prop="leaveType" label="休假类型">
          <el-select v-model="leaveForm.leaveType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="休假起始">
          <el-row>
            <el-col :span="8"
              ><el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="请选择开始日期"
                prop="startTime"
              ></el-date-picker
            ></el-col>
            <el-col :span="1">-</el-col>
            <el-col :span="8"
              ><el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="请选择结束日期"
                prop="endTime"
              ></el-date-picker
            ></el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="leaveTime" label="休假时长">
          <span>1天</span>
        </el-form-item>
        <el-form-item prop="reason" label="休假理由">
          <el-input
            v-model="leaveForm.reason"
            type="textarea"
            :rows="3"
            placeholder="请输入休假理由"
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
import util from "@/utils/util.js";
export default {
  name: "Leave",
  data() {
    return {
      queryForm: { applyState: 0 },
      leaveList: [{}],
      showModal: false,
      action: "add",
      leaveForm: {},
      currleave: {},
      actionMap: {},
      pager: { total: 0, pageSize: 10, pageNum: 1 },
      columns: [
        {
          label: "单号",
          prop: "leaveNo",
        },
        {
          label: "休假时间",
          prop: "",
          width: "200",
          formatter(row) {
            return (
              util.dateFmt(new Date(row.startTime), "yyyy-MM-dd") +
              "到" +
              util.dateFmt(new Date(row.endTime), "yyyy-MM-dd")
            );
          },
        },
        {
          label: "休假时长",
          prop: "leaveTime",
        },
        {
          label: "休假类型",
          prop: "leaveType",
          formatter(row, column, cellValue, index) {
            return { 1: "事假", 2: "调休", 3: "年假" }[cellValue];
          },
        },
        {
          label: "休假原因",
          prop: "reason",
        },
        {
          label: "申请时间",
          prop: "createTime",
          formatter(row, column, cellValue, index) {
            return util.dateFmt(new Date(cellValue));
          },
        },
        {
          label: "审批人",
          prop: "auditUser",
        },

        {
          label: "当前审批人",
          prop: "currAuditUser",
        },
        {
          label: "审批状态",
          prop: "applyState",
          formatter(row, column, cellValue, index) {
            return {
              1: "待审批",
              2: "审批中",
              3: "审批拒绝",
              4: "审批通过",
              5: "作废",
            }[cellValue];
          },
        },
      ],
      leaveRules: {
        leaveName: [
          {
            required: true,
            message: "请输入休假名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
      },
      flag: true,
    };
  },
  mounted() {
    this.getLeaveList();
  },
  methods: {
    // 获取请假申请列表
    async getLeaveList() {
      try {
        const params = { ...this.queryForm, ...this.pager };
        const { list, page } = await this.$api.getLeaveList(params);
        this.leaveList = list;
        this.pager.total = page.total;
      } catch (err) {
        throw new Error(err);
      }
    },

    // 查询请假申请列表
    handleQuery() {
      this.getLeaveList();
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 增加请假
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
    },
    // 删除请假
    async handleDel(_id) {
      await this.$api.leaveDel({ _id });
      this.$message.success("删除成功");
      this.getLeaveList();
    },
    // 编辑请假
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        // nextTick保证后续reset能够正常清空
        // this.leaveForm = row;
        Object.assign(this.leaveForm, row);
      });
    },
    // 提交 弹框操作
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          const { action, leaveForm } = this;
          let res;
          if (action === "add") {
            res = await this.$api.leaveCreate(leaveForm);
          } else if (action === "edit") {
            res = await this.$api.leaveUpdate(leaveForm);
          }

          if (res && res.affectedDocs > 0) {
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogFormRef");
            this.getLeaveList();
          } else {
            this.$message.error("操作失败,请重试");
          }
        }
      });
    },
    // 取消 弹框操作
    handleCancel(formRef) {
      if (formRef) {
        if (formRef === "dialogFormRef") {
          this.showModal = false;
        } else if (formRef === "permissionFormRef") {
          this.showPermission = false;
        }
      }
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
      this.getLeaveList();
    },
  },
};
</script>
<style lang="scss"></style>
