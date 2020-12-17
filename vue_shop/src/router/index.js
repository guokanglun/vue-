import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from "../pages/login/Login";
import Home from "../pages/home/Home";
import Welcome from "../components/Welcome";
import User from "../pages/user/User";
import Rights from "../pages/power/Rights";
import Roles from "../pages/power/Roles";

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
        redirect:'/welcome',
        children:[
            {
                path:'/welcome',
                component:Welcome
            },
            {
                path:'/users',
                component: User
            },
            {
                path:'/rights',
                component: Rights
            },
            {
                path:'/roles',
                component: Roles
            },

        ]
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
