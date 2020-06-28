<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="titleDiv">
        <img
          style="width:50px;height:50px; border-radius: 50%;background-color: #eee;"
          src="../assets/logo.png"
          alt
        />
        <span class="span">电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧导航 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggle_button">|||</div>
        <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
          <el-radio-button :label="false">展开</el-radio-button>
          <el-radio-button :label="true">收起</el-radio-button>
        </el-radio-group>-->
        <!-- 左边菜单 -->
        <!-- collapse为true展开，false关闭  router开启菜单路由 default-active的值对应index值的时候字体会高亮-->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#409BFF"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :unique-opened="true"
          style="border-right: none;"
          :collapse-transition="false"
          :router="true"
          :default-active="elmenu"
        >
          <!-- 一级菜单  v-for最好绑定一个唯一的key值 dom属性前面加一个：就可以使用vue的变量-->
          <el-submenu :index="item.id + ''" v-for="(item, i) in menuList" :key="item.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconList[i]"></i>
              <!-- 菜单内容 -->
              <span slot="title">{{ item.authName }}</span>
            </template>
            <!-- 一级菜单的子菜单 二级菜单 -->
            <el-menu-item
              :index="'/'+children.path"
              v-for="children in item.children"
              :key="children.id"
              @click="saveNavState('/'+children.path)"
            >
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 菜单内容 -->
                <span slot="title">{{ children.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 内容主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <!-- 顶部固定栏 -->
        <el-footer
          style="height:30px;"
        >Jayden © &nbsp;&nbsp;&nbsp; 联系邮箱msgboxcn@163.com &nbsp;&nbsp;&nbsp; QQ:2479664280</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>
<script>
export default {
  // 页面加载就执行的函数
  created() {
    this.getMenuList()
    this.elmenu = window.sessionStorage.getItem('menu')
  },
  data() {
    return {
      elmenu: '',
      isCollapse: false,
      menuList: [],
      iconList: ['el-icon-setting', 'el-icon-cpu', 'el-icon-goods', 'el-icon-shopping-cart-1', 'el-icon-s-data']
    }
  },
  methods: {
    logout() {
      this.$message.success({ message: '退出成功!', center: true })
      window.sessionStorage.removeItem('token') // 移除会话中缓存的token
      window.sessionStorage.removeItem('menu') // 移除会话中缓存的token
      this.$router.push('/login') // 跳转登录页
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error('菜单数据获取失败！')
      this.menuList = res.data
      console.log(res.data)
    },
    // 菜单折叠展开
    toggle_button() {
      this.isCollapse = !this.isCollapse
    },
    saveNavState(obj) {
      window.sessionStorage.setItem('menu', obj)
    }
  }
}
</script>
<style>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #313743;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.span {
  margin-left: 15px;
}
.titleDiv {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
.el-footer {
  background-color: #f5f5f5;
}
.el-footer {
  text-align: center;
}
.toggle-button {
  background-color: #2a4885;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
