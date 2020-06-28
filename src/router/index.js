import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/users.vue'
Vue.use(VueRouter)
// 解决ElementUI导航栏中的vue-router在3.0版本以上重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const router = new VueRouter({
  // 配置路由规则
  routes: [
    //   重定向 / -》 /login
    { path: '/', redirect: '/login' },
    // 访问login的时候去找导入的login组件
    { path: '/login', component: login },
    {
      path: '/home',
      component: home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: welcome
        },
        {
          path: '/users',
          component: users
        }
      ]
    }
  ]
})
// 挂载路由导航守卫
// to 将要访问的路径
// from 要跳转的页面
// next 守卫 next()放行 next('/login')强制跳转
router.beforeEach((to, from, next) => {
  // 去登陆页放行
  if (to.path === '/login') return next()
  // 获取token判断用户是否登录
  const token = window.sessionStorage.getItem('token')
  // token不存在强制跳转login
  if (!token) return next('/login')
  // token存在就放行
  next()
})

export default router
