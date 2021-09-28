import Vue from 'vue'
import VueRouter from 'vue-router'

//引入login组件
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import UserList from "../components/admin/UserList";

Vue.use(VueRouter)

const routes = [
    {
       path:"/",
       redirect:"/login"
    },
    {
      path:"/login",
      component:Login
    },
    {
        path: "/home",
        component: Home,
        redirect: "/Welcome",
        children:[
            {path:'/Welcome',component:Welcome},
            {path:'/user',component:UserList},
        ]
    }
]


const router = new VueRouter({
  routes
});



//挂载路由导航守卫
router.beforeEach((to,from,next) => {
    //to 将要访问
    //from 从哪访问
    //next 接着于 next(URL) 重定向到url上 next() 继续访问 to
    if(to.path=='/login') return next();
    //获取user
    const userflag = window.sessionStorage.getItem('user');//获取user对象
    if (!userflag) return next('/login');
    next(); //符合要求

})

//挂载路由导航守卫出现问题的时候使用
const originalPuth = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location,onResolve,onReject){
    if(onResolve || onReject) return originalPuth.call(this,location,onResolve,onReject)
    return originalPuth.call(this,location).catch(orr => orr)
}
export default router
