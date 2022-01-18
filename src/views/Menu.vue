<template>
  <div class="menu-view">
    <!-- 搜索查询模块 -->
    <div class="query-form">
      <el-form :inline="true" :model="queryForm" ref="menuQuery">
        <el-form-item prop="menuName" label="菜单名称">
          <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item prop="menuState" label="菜单状态">
          <el-select v-model="queryForm.menuState" placeholder="请输入菜单状态">
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="停用" />
          </el-select>
          <el-form-item>
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button type="danger" @click="handleReset('menuQuery')"
              >重置</el-button
            >
          </el-form-item>
        </el-form-item>
      </el-form>
    </div>
    <!-- /搜索查询模块 -->
    <!-- 主体tabel模块 -->
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd()">新增</el-button>
      </div>
      <el-table :data="menuList" row-key="_id">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              @click="handleAdd(2, scope.row)"
              type="primary"
              size="small"
              >新增</el-button
            >
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
      <!-- 分页模块 - [废弃]因为菜单管理需要展示子级等层级关系, 分页不利于展示, 而且菜单一般不会多到需要大量分页 -->
      <!-- <el-pagination
        class="pagination"
        background
        layout="prev, pager, next, jumper"
        :total="pager.total"
        :size="pager.pageSize"
        @current-change="handleCurrentChange"
      /> -->
    </div>
    <!-- /主体tabel模块 -->

    <!-- 弹窗模块 -->
    <el-dialog v-model="showModal" title="编辑菜单" center>
      <el-form
        :model="menuForm"
        ref="dialogForm"
        label-width="100px"
        :rules="menuRules"
      >
        <el-form-item prop="parentId" label="父级菜单">
          <el-cascader
            v-model="menuForm.parentId"
            :options="menuList"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'menuName',
            }"
          />
          <span>不选则直接创建一级菜单</span>
        </el-form-item>

        <el-form-item prop="menuType" label="菜单类型">
          <el-radio-group v-model="menuForm.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="menuName" label="菜单名称">
          <el-input
            v-model="menuForm.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="icon"
          label="菜单图标"
          v-show="menuForm.menuType == 1"
        >
          <el-input
            v-model="menuForm.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>

        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.path" placeholder="请输入路由地址">
          </el-input>
        </el-form-item>

        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuForm.menuType == 2"
        >
          <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识" />
        </el-form-item>

        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuForm.menuType == 1"
        >
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>

        <el-form-item label="菜单状态" prop="menuState">
          <el-radio-group v-model="menuForm.menuState">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
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
<script>
import util from "@/utils/util.js";
export default {
  name: "Menu",
  data() {
    return {
      queryForm: { menuState: 1 },
      menuList: [],
      showModal: false,
      action: "add",
      menuForm: { menuState: 1, menuType: 1 },
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
          width: 180,
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        // 组件路径不确定后续是否需要,但是先保留
        {
          label: "组件路径",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, colume, cellValue, index) {
            return { 1: "正常", 2: "停用" }[cellValue];
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
      menuRules: {
        menuName: [
          {
            required: true,
            message: "请输入菜单名称",
            trigger: "blur",
          },
          {
            min: 2,
            max: 10,
            message: "长度在2-8个字符",
            trigger: "blur",
          },
        ],
        path: [
          {
            required: () => {
              return this.menuForm.menuType == 1 ? true : false;
            },
            message: "请输入菜单路径",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    // 获取菜单列表
    async getMenuList() {
      try {
        let res = await this.$api.getMenuList(this.queryForm);
        this.menuList = res;
      } catch (err) {
        throw new Error(err);
      }
    },
    // 查询菜单列表
    handleQuery() {
      this.getMenuList();
    },
    // 表单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
    // 增加菜单
    handleAdd(type, row) {
      this.showModal = true;
      this.action = "add";
      // type === 2, 表示当前
      if (type === 2) {
        this.menuForm.parentId = [...row.parentId, row._id].filter(
          (item) => item
        );
      }
    },
    // 删除菜单
    async handleDel(_id) {
      await this.$api.menuDel({ _id });
      this.$message.success("删除成功");
      this.getMenuList();
    },
    // 编辑菜单
    handleEdit(row) {
      this.action = "edit";
      this.showModal = true;
      this.$nextTick(() => {
        // nextTick保证后续reset能够正常清空
        // this.menuForm = row;
        Object.assign(this.menuForm, row);
      });
    },
    // 提交 增加/编辑
    handleSubmit() {
      this.$refs.dialogForm.validate(async (valid) => {
        if (valid) {
          const { action, menuForm } = this;
          let res;
          if (action === "add") {
            res = await this.$api.menuCreate(menuForm);
          } else if (action === "edit") {
            res = await this.$api.menuUpdate(menuForm);
          }

          if (res && res.affectedDocs > 0) {
            this.showModal = false;
            this.$message.success("操作成功");
            this.handleReset("dialogForm");
            this.getMenuList();
          } else {
            this.$message.error("操作失败,请重试");
          }
        }
      });
    },
    // 取消 增加/编辑
    handleCancel() {
      this.showModal = false;
      this.handleReset("dialogForm");
    },
  },
};
</script>
<style lang="scss"></style>
