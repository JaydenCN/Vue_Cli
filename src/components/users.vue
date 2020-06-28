<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="params.query" clearable @clear="clearInt" placeholder="请输入内容">
            <el-button slot="append" @click="getUserList" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="dialogFormVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据表格 -->
      <el-table :data="usersList" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="role_name" label="超级管理员"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row)"
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="editUser(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="danger"
              @click="delUser(scope.row.id)"
              size="mini"
              icon="el-icon-delete"
              circle
            ></el-button>
            <el-tooltip :enterable="false" content="分配角色" placement="bottom" effect="light">
              <el-button icon="el-icon-s-tools" size="mini" circle></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="params.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible" width="50%" @close="addDialog">
      <el-form :model="addUserForm" :rules="rules" ref="addFormRef">
        <el-form-item label="用户名" label-width="100px" prop="username">
          <el-input v-model="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="addUserForm.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改对话框 -->
    <el-dialog title="编辑用户" :visible.sync="EditDia" width="50%" @close="EdieDialog">
      <el-form :model="editForm" :rules="rules" ref="editFormRef">
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="editForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="100px" prop="email">
          <el-input v-model="editForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" label-width="100px" prop="mobile">
          <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="EditDia = false">取 消</el-button>
        <el-button type="primary" @click="EditForm">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    var checkEmail = (rule, value, cailback) => {
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) return cailback()
      else return cailback(new Error('请输入合法的邮箱！'))
    }
    var checkMobile = (rule, value, cailback) => {
      const regMobile = /^[1][3|4|5|6|7|8|9][0-9]{9}$/
      if (regMobile.test(value)) return cailback()
      else return cailback(new Error('请输入合法的手机号！'))
    }
    return {
      params: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      usersList: [],
      total: 0,
      //   显示/隐藏对话框
      dialogFormVisible: false,
      EditDia: false,
      //   添加用户的
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        email: '',
        id: '',
        mobile: '',
        rid: '',
        username: ''
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名3-10之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 5, max: 12, message: '密码5-12之间', trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        mobile: [{ validator: checkMobile, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.params })
      if (res.meta.status === 200) {
        console.log(res.data)
        this.$message.success({ message: '用户数据获取成功！', center: true })
        this.usersList = res.data.users
        this.total = res.data.total
      } else {
        this.$message.error({ message: '用户数据获取失败！', center: true })
        return false
      }
    },
    // 监听每页显示多少条数据
    handleSizeChange(newLimit) {
      this.params.pagesize = newLimit
      this.getUserList()
    },
    // 监听页码值改变
    handleCurrentChange(newPage) {
      this.params.pagenum = newPage
      this.getUserList()
    },
    // 监听switch开关
    async switchChange(userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status === 200) this.$message.success('状态修改成功！')
      else {
        this.$message.error('状态修改失败！')
        userinfo.mg_state = !userinfo.mg_state
      }
    },
    clearInt() {
      this.params.query = ''
      this.getUserList()
    },
    // 对话框关闭初始化表单
    addDialog() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交添加
    addUser() {
      this.$refs.addFormRef.validate(async res => {
        if (res) {
          console.log(this.addUserForm)
          const { data: res } = await this.$http.post('users', this.addUserForm)
          console.log(res)
          if (res.meta.status === 201) {
            this.$message.success('已添加！')
            // 隐藏对话框
            this.dialogFormVisible = false
            // 刷新数据
            this.getUserList()
          } else {
            this.$message.success('添加失败！')
          }
        } else {
          this.$message.error('数据不合法，请检查数据！')
        }
      })
    },
    async editUser(userId) {
      this.EditDia = true
      const { data: res } = await this.$http.get(`users/${userId}`)
      if (res.meta.status === 200) {
        this.$message.success('获取成功！')
        this.editForm = res.data
      } else {
        this.$message.success('添加失败！')
      }
    },
    EdieDialog() {
      this.$refs.editFormRef.resetFields()
    },
    EditForm() {
      this.$refs.editFormRef.validate(async res => {
        if (res) {
          const { data: res } = await this.$http.put(`users/${this.editForm.id}`, { email: this.editForm.email, mobile: this.editForm.mobile })
          console.log(res)
          if (res.meta.status === 200) {
            this.$message.success('编辑成功！')
            // 隐藏对话框
            this.EditDia = false
            // 刷新数据
            this.getUserList()
          } else {
            this.$message.success('编辑失败！')
          }
        } else {
          this.$message.error('数据不合法，请检查数据！')
        }
      })
    },
    async delUser(id) {
      const confirmResust = await this.$confirm('此操作将永久该记录, 是否继续?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      // 点击取消删除返回 cancel 确定返回comfirm
      console.log(confirmResust)
      if (confirmResust === 'cancel') {
        return this.$message.info('已经取消删除！')
      } else {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getUserList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败!'
          })
        }
      }
    }
  }
}
</script>
<style  scope></style>
