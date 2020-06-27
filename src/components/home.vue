<template>
  <div>
    <el-button type="info" @click="logout">退出</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$message.success({ message: '退出成功!', center: true })
      window.sessionStorage.removeItem('token') // 移除会话中缓存的token
      this.$router.push('/login') // 跳转登录页
    }
  }
}
</script>
<style></style>
