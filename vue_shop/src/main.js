import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/reset.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

// 配置axios
import axios from  'axios'
// 基础地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// 请求拦截器
axios.interceptors.request.use(config=>{
    // 接口文档要求： 需要授权的 API ，必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
   config.headers.Authorization = window.sessionStorage.getItem('token');
   return config
});
Vue.prototype.$http = axios;


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
