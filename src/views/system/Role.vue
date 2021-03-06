<template>
  <div class="role-view">
    <!-- 搜索查询模块 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="queryFormRef">
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="queryForm.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="handleQuery"
            v-has:type="'role-query'"
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
          v-has:type="'role-create'"
          >新增</el-button
        >
      </div>
      <el-table :data="roleList">
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
              v-has:type="'role-update'"
              >编辑</el-button
            >
            <el-button
              @click="handlePermission(scope.row)"
              type="primary"
              size="small"
              v-has:type="'role-update'"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="small"
              v-has:type="'role-delete'"
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
      title="编辑角色"
      center
      :before-close="handleClose"
    >
      <el-form
        :model="roleForm"
        ref="dialogFormRef"
        label-width="100px"
        :rules="roleRules"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input
            v-model="roleForm.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>

        <el-form-item prop="remark" label="备注">
          <el-input
            type="textarea"
            :rows="2"
            v-model="roleForm.remark"
            placeholder="请输入备注"
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

    <!-- 弹窗模块 - 权限弹框 -->
    <el-dialog v-model="showPermission" title="编辑角色" center>
      <el-form
        :model="permissionForm"
        ref="permissionFormRef"
        label-width="100px"
      >
        <el-form-item prop="roleName" label="角色名称">
          {{ currRole.roleName }}
        </el-form-item>

        <el-form-item prop="permissionConfig" label="权限设置">
          <el-tree
            ref="permissionTreeRef"
            :data="menuList"
            show-checkbox
            node-key="_id"
            :props="{ label: 'menuName', children: 'children' }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel('permissionFormRef')">取消</el-button>
          <el-button type="primary" @click="handlePermissionSubmit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
    <!-- /弹窗模块 - 权限弹窗 -->
  </div>
</template>
<script>
import util from "@/utils/util.js";
export default {
  name: "Menu",
  data() {
    return {
      queryForm: { roleName: "" },
      roleList: [],
      showModal: false,
      action: "add",
      roleForm: {},
      menuList: [],
      showPermission: false,
      permissionForm: {},
      currRole: {},
      actionMap: {},
      pager: { total: 0, pageSize: 10, pageNum: 1 },
      columns: [
        {
          label: "角色名称",
          prop: "roleName",
          width: 150,
        },
        {
          label: "备注",
          prop: "remark",
        },
        {
          label: "权限列表",
          prop: "permissionList",
          formatter: (row, column, cellValue, index) => {
            let list = cellValue.halfCheckedKeys || [];
            let names = [];
            list.forEach((key) => {
              key ? names.push(this.actionMap[key]) : null;
            });
            return names.filter((item) => item).join(",");
          },
        },
        {
          label: "创建时间",
          prop: "createTime",
          formatter(row, colume, cellValue, index) {
            return cellValue ? util.dateFmt(new Date(cellValue)) : null;
          },
        },
      ],
      roleRules: {
        roleName: [
          {
            required: true,
            message: "请输入角色名称",
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
    };
  },
  mounted() {
    this.getRoleList();
    this.getMenuList();
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      try {
        const params = { ...this.queryForm, ...this.pager };
        const { list, page } = await this.$api.getRoleList(params);
        this.roleList = list;
        this.pager.total = page.total;
      } catch (err) {
        throw new Error(err);
      }
    },
    // 获取菜单列表
    async getMenuList() {
      try {
        // 因为在登陆的时候已经完成路由自动加载并设定对应的菜单权限, 所以这里无需再重复请求
        //只需对持久化的数据进行一次判断即可
        let menuList = this.$storage.getItem("menuList");
        if (!menuList || menuList.length <= 0) {
          let res = this.$api.getMenuList();
          menuList = res.menuList;
          actionList = res.actionList;
          this.$store.commit("saveUserMenus", menuList);
          this.$store.commit("saveUserActions", actionList);
        }
        this.menuList = menuList;
        this.getActionMap(menuList.slice());
      } catch (err) {
        throw new Error(err);
      }
    },
    // 查询角色列表
    handleQuery() {
      this.getRoleList();
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 增加角色
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
    },
    // 删除角色
    async handleDel(_id) {
      await this.$api.roleDel({ _id });
      this.$message.success("删除成功");
      this.getRoleList();
    },
    // 编辑角色
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        // nextTick保证后续reset能够正常清空
        // this.roleForm = row;
        Object.assign(this.roleForm, row);
      });
    },
    // 提交 弹框操作
    handleSubmit() {
      this.$refs.dialogFormRef.validate(async (valid) => {
        if (valid) {
          const { action, roleForm } = this;
          let res;
          if (action === "add") {
            res = await this.$api.roleCreate(roleForm);
          } else if (action === "edit") {
            res = await this.$api.roleUpdate(roleForm);
          }

          if (res && res.affectedDocs > 0) {
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogFormRef");
            this.getRoleList();
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
      this.getRoleList();
    },
    handlePermission(row) {
      this.showPermission = true;
      this.$nextTick(() => {
        Object.assign(this.currRole, row);
        const { checkedKeys } = this.currRole.permissionList;
        this.$refs.permissionTreeRef.setCheckedKeys(checkedKeys);
      });
    },
    async handlePermissionSubmit() {
      let nodes = this.$refs.permissionTreeRef.getCheckedNodes();
      let halfKeys = this.$refs.permissionTreeRef.getHalfCheckedKeys();
      let checkedKeys = [];
      let parentKeys = [];
      nodes.forEach((node) => {
        if (!node.children) {
          checkedKeys.push(node._id);
        } else {
          parentKeys.push(node._id);
        }
      });

      const params = {
        _id: this.currRole._id,
        permissionList: {
          checkedKeys,
          halfCheckedKeys: parentKeys.concat(halfKeys),
        },
      };
      let res = await this.$api.roleUpdatePermission(params);
      if (res && res.affectedDocs > 0) {
        this.showPermission = false;
        this.$message.success("更新成功");
        this.getRoleList();
      }
    },
    //判断每层菜单是否具备"action"属性
    //如果具备, 则说明是按钮的上一层级菜单,所以会将角色对应的这层菜单权限添加到actionMap, 用于表单'权限列表'一栏展示
    getActionMap(list) {
      let actionMap = {};
      const deep = (arr) => {
        arr.forEach((item) => {
          if (item.children && item.children.length > 0 && item.action) {
            actionMap[item._id] = item.menuName;
          } else if (
            item.children &&
            item.children.length > 0 &&
            !item.action
          ) {
            deep(item.children);
          }
        });
      };

      deep(list);
      this.actionMap = actionMap;
    },
  },
};
</script>
<style lang="scss"></style>
