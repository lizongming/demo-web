<!-- 用户--授权 -->
<template>
  <el-container style="width: 100%;height: 100%" >
    <!-- 头部--查询条件 -->
    <el-header>
      <el-form :inline="true" :model="userParamFrom" ref="resetForm" size="small" class="demo-form-inline" style="text-align:left">
        <el-form-item label="名称:" prop="account">
          <el-input v-model="userParamFrom.account" />
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
        <el-table-column prop="createTime" label="日期"/>
        <el-table-column prop="code" label="编码" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="email" label="邮箱"/>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="roleMenu(scope.row)"  type="text" style="color: red" size="small">授权</el-button>
            <el-button type="text" style="color: red" size="small">删除</el-button>
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
      <el-form :label-position="labelPosition" label-width="80px" :model="savaForm" ref="savaForm" size="small">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="savaForm.name"/>
        </el-form-item>
        <el-form-item label="住址:" prop="code">
          <el-input v-model="savaForm.code"/>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="savaForm.email"/>
        </el-form-item>
        <el-form-item label="联系方式:" prop="phone">
          <el-input v-model="savaForm.phone"/>
        </el-form-item>
        <el-form-item label="学历:" prop="education">
          <el-input v-model="savaForm.education"/>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button icon="el-icon-circle-plus" type="primary" round size="small" @click="savaSubmit">保存</el-button>
            <el-button icon="el-icon-remove" type="primary" round size="small"  @click="closeDialog('savaForm')">关闭</el-button>
          </template>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="授权" :visible.sync="roleMenuDialog" width="400px" center>
      <el-form :label-position="labelPosition" label-width="70px" :model="roleMenuForm" ref="roleMenuForm" size="small">
        <el-form-item label="用户:" prop="name">
          <el-input v-model="roleMenuForm.name"/>
        </el-form-item>
        <el-form-item label="授权:" prop="role">
          <el-select v-model="roleMenuForm.role" placeholder="请选择" style="width: 220px" v-loading="loadingRole">
            <el-option
              v-for="item in roleOptions"
              :key="item.name"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <template slot-scope="scope">
            <el-button icon="el-icon-circle-plus" type="primary" round size="small" @click="roleMenuSubmit">保存</el-button>
            <el-button icon="el-icon-remove" type="primary" round size="small"  @click="closeDialog('roleMenuForm')">关闭</el-button>
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
        loading: false,
        loadingRole: false,
        savaDialog: false,
        roleMenuDialog: false,
        userParamFrom: {
          pageNo: 1,
          limit: 10,
          account: ''
        },
        page: {
          pageNo: 1,
          limit: 10,
          sizes: [10, 50, 100],
          total: 0
        },
        tableData: [],
        labelPosition: 'right',
        savaForm:{
          name: '',
          code: '',
          email: '',
          phone: '',
          education: ''
        },
        // 查询权限--角色参数
        queryRoleParam: {
          name: '',
          pageNo: 1,
          limit: 999
        },
        // 授权对象
        roleMenuForm: {
          uId: '',
          name: '',
          role: ''
        },
        userId: {
          id: ''
        },
        // 角色对象
        roleOptions: []
      };
    },
    mounted() {
      this.queryTableData()
    },

    methods: {
      // 条件查询
      queryTableData() {
        this.loading = true
        this.$api.user.findPage(this.userParamFrom).then(res => {
          this.tableData = res.data
          this.page.total = res.pageTotal
          this.loading = false
        });
      },
      // 新增用户保存
      savaSubmit() {
        this.loading = true
        this.$api.user.sava(this.savaForm).then(res => {
          if(res.success) {
            this.tableData.unshift(res.data[0])
            this.page.total = this.page.total + 1
            this.savaDialog = false
            this.$message.success("成功加入了小伙伴！！！")
          } else {
            this.$message.error("新增错误,联系网管！！！")
          }
          this.loading = false
        })
      },
      // 授权
      roleMenuSubmit() {
        this.roleMenuForm.uId = this.userId.id
        this.$api.user.savaUserRole(this.roleMenuForm).then(res => {
          console.info("操作成功！" + res)
        })
      },
      // 打开弹框
      openSavaDialog() {
        this.savaDialog = true
      },
      // 授权
      roleMenu(row) {
        this.roleMenuDialog = true
        this.loadingRole = true
        this.roleMenuForm.name = row.name
        this.userId.id = row.id
        this.$api.user.getUserRole(this.userId).then(res => {
          this.roleMenuForm.role = res
        });
        // 查询角色
        this.$api.role.findPage(this.queryRoleParam).then(res => {
          this.roleOptions = res.data
          this.loadingRole = false
        });
      },
      // 分页 -- 每页 ${val} 条
      handleSizeChange(val) {
        this.page.size = +val;
        this.page.limit = +val;
        this.userParamFrom.limit = val;
        this.queryTableData();
      },
      // 分页-- 当前页: ${val}
      handleCurrentChange(val) {
        this.page.pageNo = val;
        this.userParamFrom.pageNo = val;
        this.queryTableData();
      },
      closeDialog(formName) {
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
