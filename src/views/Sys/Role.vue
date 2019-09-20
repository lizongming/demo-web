<!-- 角色--授权 -->
<template>
  <el-container style="width: 100%;height: 100%" >
    <!-- 头部--查询条件 -->
    <el-header>
      <el-form :inline="true" :model="roleParamFrom" ref="resetForm" size="small" class="demo-form-inline" style="text-align:left">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="roleParamFrom.name" />
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="primary"  @click="queryTableData">查询</el-button>
          <el-button icon="el-icon-refresh" type="primary" @click="resetForm('resetForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <div style="width:100%;height:1px; background:#E0E0E0;"></div>
    <!--表格-->
    <el-main>
      <el-header style="text-align:right">
        <el-button icon="el-icon-circle-plus" type="primary" round size="small" @click="openSavaDialog">新增</el-button>
        <el-button icon="el-icon-download" type="primary" round size="small">导出</el-button>
        <el-button icon="el-icon-upload" type="primary" round size="small">导入</el-button>
      </el-header>

      <el-table :data="tableData" border style="width: 100%" v-loading="loading" size="small">
        <el-table-column prop="name" label="角色" />
        <el-table-column prop="remark" label="备注"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" style="color: red" round size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--分页start-->
      <div class="block">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page="page.pageNo"
                       :page-sizes="page.sizes"
                       :page-size="page.limit"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="page.total" style="text-align: center;margin:20px 0;">
        </el-pagination>
      </div>
    </el-main>
    <!--分页end-->

    <el-dialog title="新增" :visible.sync="savaDialog" width="400px" center>
      <el-form :label-position="labelPosition" label-width="90px" style="padding-right: 40px;" :model="savaForm" ref="savaForm" :rules="check" size="small">
        <el-form-item label="角色:" prop="name">
          <el-input v-model="savaForm.name"/>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input v-model="savaForm.remark"/>
        </el-form-item>
        <el-form-item label="分配权限:" prop="code">
          <el-tree style="height: 200px;overflow-y: auto;box-shadow: 0 0px 0.48px;"
                   :data="dataTree" ref="tree" show-checkbox node-key="id" :props="treeProps">
          </el-tree>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button icon="el-icon-circle-plus" type="primary" round size="small" @click="savaSubmit">保存</el-button>
            <el-button icon="el-icon-remove" type="primary" round size="small"  @click="closeDialog('savaForm')">关闭</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>

  </el-container>
</template>

<script>

  export default {
    data() {
      return {
        // 加载标志
        loading: false,
        // 新增弹框
        savaDialog: false,
        //树对象
        dataTree: [],
        //查询参数
        roleParamFrom: {
          pageNo: 1,
          limit: 10,
          name: ''
        },
        //分页
        page: {
          pageNo: 1,
          limit: 10,
          sizes: [10, 50, 100],
          total: 0
        },
        // 表格对象
        tableData: [],
        // 新增form左对齐
        labelPosition: 'right',
        // 新增参数
        savaForm:{
          name: '',
          remark: '',
          roleIds: ''
        },
        // 指定tree属性
        treeProps: {
          children: 'children',
          label: 'name'
        },
        check: {
          name: [
            { required: true, message: '请输入角色名称！！！', trigger: 'blur' }
          ]
        }
      };
    },
    mounted() {
      this.queryTableData()
    },

    methods: {
      // 条件查询
      queryTableData() {
        this.loading = true
        this.$api.role.findPage(this.roleParamFrom).then(res => {
          this.tableData = res.data
          this.page.total = res.pageTotal
          this.loading = false
        });
      },
      // 新增用户保存
      savaSubmit() {
        this.loading = true
        this.savaForm.roleIds = this.$refs.tree.getCheckedKeys()
        this.$api.role.save(this.savaForm).then(res => {
          this.tableData.unshift(res.data)
          this.page.total = res.pageTotal
          this.loading = false
          this.$refs['savaForm'].resetFields();
          this.$refs.tree.setCheckedKeys([]);
        });
      },
      // 打开弹框
      openSavaDialog() {
        this.savaDialog = true
        let name = ''
        this.$api.menu.findNavTree(name).then(res => {
          this.dataTree = res.data
        });
      },
      // 分页 -- 每页 ${val} 条
      handleSizeChange(val) {
        this.page.size = +val;
        this.page.limit = +val;
        this.roleParamFrom.limit = val;
        this.queryTableData();
      },
      // 分页-- 当前页: ${val}
      handleCurrentChange(val) {
        this.page.pageNo = val;
        this.userParamFrom.pageNo = val;
        this.queryTableData();
      },
      // 关闭弹框
      closeDialog(formName) {
        this.$refs.tree.setCheckedKeys([]);
        this.savaDialog = false
        this.$refs[formName].resetFields();
      },
      // 重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    }
  };
</script>

<style lang="scss" scoped>
  .el-input {
    width: 220px;
  }
</style>
