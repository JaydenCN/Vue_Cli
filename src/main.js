import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import './plugins/element.js'
// 导入全局样式表
import './assets/css/global.css'
import './assets/font/iconfont.css'
// 配置请求的根路径
axios.defaults.baseURL = 'http://182.92.226.143:8083/'
// 挂载到vue的全局对象上，所有模块都能通过this调用
Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
