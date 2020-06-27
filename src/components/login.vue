<template>
  <div class="login_container">
    <!-- 剧中div -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="head_portrait_box">
        <img src="../assets/logo.png" class="imgLogin" alt />
      </div>
      <!-- 表单区域  :rules验证数据合法性 :model绑定form表单数据 ref标记引用表单-->
      <el-form ref="loginFormRef" :model="form" :rules="rules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="userName">
          <el-input v-model="form.userName" prefix-icon="iconfont icon-yonghu"></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password" prefix-icon="iconfont icon-suo1" show-password></el-input>
        </el-form-item>
        <!-- 操作按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="submitForm">登入</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import qs from 'qs'
export default {
  data() {
    return {
      // 登录表单的数据绑定
      form: {
        userName: 'Jayden',
        password: 'admin'
      },
      // 验证表单数据的合法性
      rules: {
        // 验证用户名
        userName: [
          { required: true, message: '请输入登录用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 5, max: 12, message: '长度在 5 到 12个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm() {
      // validate判断表单数据是否都合法，返回布尔值
      this.$refs.loginFormRef.validate(async valid => {
        if (valid) {
          // 验证通过
          const qsData = qs.stringify({ userName: this.form.userName, password: this.form.password })
          // 获取响应列表中的data赋值给res 解构赋值
          const { data: res } = await this.$http.post('login', qsData)
          if (res.code === 200) {
            this.$message.success({ message: res.message, center: true })
            window.sessionStorage.setItem('token', res.token) // 存到本地浏览器会话存储中，关闭即消失
            this.$router.push('/home')
          } else {
            this.$message.error({ message: res.message, center: true })
          }
        } else {
          // 警告信息
          this.$message.warning({ message: '数据不合法！', center: true })
          return false
        }
      })
    },
    resetForm() {
      // 重置表单数据 -> 表单ref的引用值标记要重置的表单
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>
// scoped 设置样式只有本组件生效
<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute; /*绝对定位*/
  left: 50%;
  top: 50%; /* 这50%是相对于左上角，所以此时这个div只有左上角是在正中心 */
  transform: translate(-50%, -50%); /* 要想div正中心位于页面的中心点，要减去它自身x，y轴的各50% */
}
.head_portrait_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}
.imgLogin {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>
