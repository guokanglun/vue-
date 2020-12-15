import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";

Vue.use(VueRouter);

// 配置路由
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
    {
        path: '/home',
        name: 'home',
        component: Home,
    },

  {
    path:'/',
    redirect:'/login'
  }

];

const router = new VueRouter({
  routes
});

// 路由导航守卫
/*
    to: 到某个地址
    from: 从哪个地址来
    next： 是否放行
 */
router.beforeEach((to, from, next)=>{
    // 访问登页直接放行
    if(to.path==='/login') return next();
    const tokenStr = window.sessionStorage.getItem('token');
    if(tokenStr){
        next()
    }else{
        next('/login')
    }
});


export default router
