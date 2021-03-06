<template>
  <div class="user-view">
    <!-- 搜索查询模块 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryFormRef">
        <el-form-item prop="userId" label="用户ID">
          <el-input v-model="queryForm.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item prop="userName" label="用户名">
          <el-input v-model="queryForm.userName" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item prop="state" label="状态">
          <el-select v-model="queryForm.state">
            <el-option :value="0" label="所有" />
            <el-option :value="1" label="在职" />
            <el-option :value="2" label="离职" />
            <el-option :value="3" label="试用期" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleQuery" v-has:type="'user-query'">查询</el-button>
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
        <el-button type="primary" @click="handleAdd" v-has:type="'user-create'"
          >新增</el-button
        >
        <el-button
          type="danger"
          @click="handleBatchDel"
          v-has:type="'user-delete'"
          >批量删除</el-button
        >
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" />
        <!-- 实际上用v-bind="item"会更简洁 -->
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleEdit(scope.row)"
              type="primary"
              size="small"
              v-has:type="'user-update'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel({ row: scope.row })"
              v-has:type="'user-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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

    <!-- 弹窗模块 -->
    <el-dialog
      v-model="showModal"
      title="编辑用户"
      center
      :before-close="handleClose"
    >
      <el-form
        :model="userForm"
        ref="dialogFormRef"
        label-width="100px"
        :rules="userRules"
      >
        <el-form-item prop="userName" label="用户名">
          <el-input
            v-model="userForm.userName"
            placeholder="请输入用户名"
            :disabled="action == 'edit'"
          />
        </el-form-item>
        <el-form-item prop="userPwd" label="用户密码" v-if="action == 'add'">
          <el-input v-model="userForm.userPwd" placeholder="请输入密码" />
        </el-form-item>

        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input
            v-model="userForm.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action == 'edit'"
          >
            <template #append>
              <span>@manager.com</span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="用户手机号" prop="mobile">
          <el-input
            type="number"
            v-model="userForm.mobile"
            placeholder="请输入用户手机号"
          />
        </el-form-item>
        <el-form-item label="用户性别" prop="sex">
          <el-select v-model="userForm.sex" placeholder="请选择用户性别">
            <el-option :value="0" label="男性"></el-option>
            <el-option :value="1" label="女性"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-select v-model="userForm.state" placeholder="请选择用户状态">
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userForm.roleList"
            multiple
            style="width: 100%"
            placeholder="请选择系统角色"
          >
            <el-option
              v-for="role in roleAllList"
              :key="role._id"
              :value="role._id"
              :label="role.roleName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userForm.deptId"
            placeholder="请选择所属部门"
            :options="deptTreeList"
            :props="{ checkStrictly: true, value: '_id', label: 'deptName' }"
            show-all-levels
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- /弹窗模块 -->
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, getCurrentInstance, toRaw } from "vue";
import util from "@/utils/util.js";
const { ctx } = getCurrentInstance();
// 查询模块对象
const queryForm = reactive({ state: 0 });
// 分页模块对象
const pager = reactive({
  pageNum: 1,
  pageSize: 10,
});
// table主体对象
const userList = ref([]);

const columns = reactive([
  {
    label: "用户ID",
    prop: "userId",
  },
  {
    label: "用户名",
    prop: "userName",
  },
  {
    label: "用户邮箱",
    prop: "userEmail",
  },
  {
    label: "用户角色",
    prop: "role",
    formatter(row, column, cellValue, index) {
      return {
        0: "管理员",
        1: "普通用户",
      }[cellValue];
    },
  },
  {
    label: "用户状态",
    prop: "state",
    formatter(row, column, cellValue, index) {
      return {
        1: "在职",
        2: "离职",
        3: "试用期",
      }[cellValue];
    },
  },
  {
    label: "注册时间",
    prop: "createTime",
    formatter(row, colume, cellValue, index) {
      return cellValue ? util.dateFmt(new Date(cellValue)) : null;
    },
  },
  {
    label: "最后登录时间",
    prop: "lastLoginTime",
    formatter(row, colume, cellValue, index) {
      return cellValue ? util.dateFmt(new Date(cellValue)) : "无登录记录";
    },
  },
]);

// table主体多选功能关联的userId
const checkedIds = ref([]);
// 弹框显示控制flag
const showModal = ref(false);
// 弹框用户对象
const userForm = reactive({
  state: 3,
  sex: 0,
});
// 角色列表=>用于弹框内选择,编辑用户的角色,
const roleAllList = ref([]);
// 部门列表=>用于弹框内选择,编辑用户所在部门
const deptTreeList = ref([]);
const action = ref("add");

// 表单校验规则
const userRules = reactive({
  userName: [
    {
      required: true,
      message: "请输入用户姓名",
      trigger: "blur",
    },
  ],
  userPwd: [
    {
      required: action.value === "add" ? true : false,
      message: "请输入 用户密码",
      trigger: "blur",
    },
    // Todo 密码正则校验
  ],
  userEmail: [
    {
      required: true,
      message: "请输入用户邮箱",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /1[3-9]\d{9}/,
      message: "请输入正确手机号格式",
      trigger: "blur",
    },
  ],
  deptId: [
    {
      required: true,
      message: "请选择用户所在部门",
      trigger: "blur",
    },
  ],
});
// 获取用户列表
const getUserList = async () => {
  const params = { ...queryForm, ...pager };
  try {
    const { list, page } = await ctx.$api.getUserList(params);
    // console.log({list, page});
    userList.value = list;
    pager.total = page.total;
  } catch (err) {
    console.log(err);
  }
};

// 查询用户列表
const handleQuery = () => {
  getUserList();
};

// 重置用户列表
const handleReset = (form) => {
  //   console.log(ctx.$refs.form);
  ctx.$refs[form].resetFields();
};

// 删除单个用户
/**
 * row {proxy} 表单中单个删除时传入,直接在template中写入参
 * ids {array} 表单中多个删除时传入
 */
const handleDel = async ({ row, ids = [] }) => {
  try {
    let userIds = [];
    //参数校验及筛选
    if (row && row.userId) {
      userIds.push(row.userId);
    }
    if (ids && ids.length > 0) {
      userIds = userIds.concat(ids);
    }
    if (userIds.length <= 0) return;

    let res = await ctx.$api.userDel({
      userIds, //可单个删除或者多个删除
    });

    if (res && res.affectedDocs > 0) {
      //返回字段变动时将影响判断,需要非常注意
      ctx.$message.success("成功删除");
      getUserList();
    } else if (res && res.affectedDocs <= 0) {
      ctx.$message.success('该人员已删除/设置为"离职"');
    } else {
      ctx.$message.error("删除失败");
    }
  } catch (err) {
    console.log(err);
  }
};

// 批量删除用户
const handleBatchDel = async () => {
  if (checkedIds.value.length <= 0) {
    ctx.$message.error("请选择要删除的用户");
  } else {
    handleDel({ ids: checkedIds.value });
  }
};

// 增加新用户
const handleAdd = () => {
  action.value = "add";
  showModal.value = true;
};
// 编辑用户
const handleEdit = (row) => {
  action.value = "edit";
  showModal.value = true;
  ctx.$nextTick(() => {
    Object.assign(userForm, row);
  });
};

//分页
const handleCurrentChange = (current) => {
  pager.pageNum = current;
  getUserList();
};
//多选
const handleSelectionChange = (list) => {
  // checkedIds.value是一个Proxy对象
  checkedIds.value = list.map(
    (item) => JSON.parse(JSON.stringify(item)).userId
  );
};

const getRoleAllList = async () => {
  try {
    const { list } = await ctx.$api.getRoleAllList();
    roleAllList.value = list;
  } catch (err) {
    console.log(err);
  }
};

const getDeptTreeList = async () => {
  try {
    const { list } = await ctx.$api.getDeptTreeList();
    deptTreeList.value = list;
  } catch (err) {
    console.log(err);
  }
};

// 用户弹窗关闭
const handleCancel = () => {
  showModal.value = false;
  handleReset("dialogFormRef");
};

// 用于用户点击到遮罩时候重置弹框
const handleClose = (done) => {
  handleCancel("dialogFormRef");
  done();
};
// 用户提交
const handleSubmit = () => {
  // showModal.value = false;
  ctx.$refs.dialogFormRef.validate(async (valid) => {
    if (valid) {
      let params = toRaw(userForm); //把响应式对象转换成普通对象
      params.userEmail = /@/.test(params.userEmail)
        ? params.userEmail
        : params.userEmail + "@manager.com";
      let res, message;
      if (action.value == "add") {
        res = await ctx.$api.userCreate(params);
        message = "用户新增成功";
      } else if (action.value == "edit") {
        res = await ctx.$api.userUpdate(params);
        message = "用户更新成功";
      }
      if (res && res.affectedDocs > 0) {
        showModal.value = false;
        ctx.$message.success(message);
        handleReset("dialogFormRef");
        getUserList();
      } else if (res && res.affectedDocs <= 0) {
        if (action.value == "add") {
          ctx.$message.error("创建失败");
        } else if (action.value == "edit") {
          ctx.$message.success("信息无变更");
        }
      } else {
        if (action.value == "add") {
          ctx.$message.error("创建失败");
        } else if (action.value == "edit") {
          ctx.$message.success("更新失败");
        }
      }
    }
  });
};

onMounted(() => {
  getUserList();

  getRoleAllList();
  getDeptTreeList();
});
</script>
<style lang="scss"></style>
