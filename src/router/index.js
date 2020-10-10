import Vue from 'vue'
// 1. 引入vue-router
import VueRouter from 'vue-router'

// 引入store
import store from '../store'

// 2. 给vue安装路由插件, 让每一个组件中都可以使用router-link和router-view组件
Vue.use(VueRouter);


// 3. 配置路由---路由映射关系
var routes = [
    {
        path: '/',
        // 路由懒加载
        redirect:'/index',
        component: () => import('../components/Home'),
        children:[
            {
                path: '/index',
                component: () => import('../components/pages/Index'),
                meta:{select: '/index'}
            },
            // 菜单管理
            {
                path: '/menu',
                component: () => import('../components/pages/menu/Menu'),
                meta:{select: '/menu'}
            },
            {
                path: '/menu/add',
                component: () => import('../components/pages/menu/Infomenu'),
                meta:{select: '/menu'}
            },
            {
                path: '/menu/:id',
                component: () => import('../components/pages/menu/Infomenu'),
                meta:{select: '/menu'}
            },
            
            // 角色管理
            {
                path: '/role',
                component: () => import('../components/pages/role/Role'),
                meta:{select: '/role'}
            },
            {
                path: '/role/add',
                component: () => import('../components/pages/role/Inforole'),
                meta:{select: '/role'}
            },
            {
                path: '/role/:id',
                component: () => import('../components/pages/role/Inforole'),
                meta:{select: '/role'}
            },

            // 管理员管理
            {
                path: '/user',
                component: () => import('../components/pages/user/User'),
                meta:{select: '/user'}
            },
            {
                path: '/user/add',
                component: () => import('../components/pages/user/Infouser'),
                meta:{select: '/user'}
            },
            {
                path: '/user/:uid',
                component: () => import('../components/pages/user/Infouser'),
                meta:{select: '/user'}
            },

            // 商品分类
            {
                path: '/category',
                component: () => import('../components/pages/category/Category'),
                meta:{select: '/category'}
            },
            {
                path: '/category/add',
                component: () => import('../components/pages/category/Infocategory'),
                meta:{select: '/category'}
                
            },
            {
                path: '/category/:id',
                component: () => import('../components/pages/category/Infocategory'),
                meta:{select: '/category'}
            },

            // 商品规格
            {
                path: '/specs',
                component: () => import('../components/pages/specs/Specs'),
                meta:{select: '/specs'},
            },
            {
                path: '/specs/add',
                component: () => import('../components/pages/specs/Infospecs'),
                meta:{select: '/specs'},
            },
            {
                path: '/specs/:id',
                component: () => import('../components/pages/specs/Infospecs'),
                meta:{select: '/specs'},
            },
            // 商品管理
            {
                path: '/goods',
                component: () => import('../components/pages/goods/Goods'),
                meta:{select: '/goods'}
            },
            {
                path: '/goods/add',
                component: () => import('../components/pages/goods/Infogoods'),
                meta:{select: '/goods'}
            },
            {
                path: '/goods/:id',
                component: () => import('../components/pages/goods/Infogoods'),
                meta:{select: '/Updategoods'}
            },
            // 会员管理
            {
                path: '/member',
                component: () => import('../components/pages/member/Member'),
                meta:{select: '/member'}
            },
            {
                path: '/member/:uid',
                component: () => import('../components/pages/member/Infomember'),
                meta:{select: '/member'}
            },
            // 轮播图管理
            {
                path: '/banner',
                component: () => import('../components/pages/banner/Banner'),
                meta:{select: '/banner'}
            },
            {
                path: '/banner/add',
                component: () => import('../components/pages/banner/Infobanner'),
                meta:{select: '/banner'}
            },
            {
                path: '/banner/:id',
                component: () => import('../components/pages/banner/Infobanner'),
                meta:{select: '/banner'}
            },

            // 秒杀
            {
                path: '/seckill',
                component: () => import('../components/pages/seckill/Seckill'),
                meta:{select: '/seckill'}
            },
            {
                path: '/seckill/add',
                component: () => import('../components/pages/seckill/Infoseckill'),
                meta:{select: '/seckill'}
            },
            {
                path: '/seckill/:id',
                component: () => import('../components/pages/seckill/Infoseckill'),
                meta:{select: '/seckill'}
            },
        ]
    }, 
    {
        path: '/login',
        component: () => import('../components/Login'),
    }
]

// 4: 实例化路由对象
var router = new VueRouter({
    routes,
    mode: 'history' // 路由模式: 默认为hash模式 ,也就是带#号,   history模式不带
});

// 全局守卫, 守卫的是所有的路由, 进入每一个路由之前执行
router.beforeEach((to, from, next) => {
    // 如果进入登录页面, 直接进
    if(to.path=='/login'){
        next();
        return
    }
    // 如果进入其他页面, 判断有没有token
    // if(!sessionStorage.getItem('token')){
    if(!store.getters.getuserinfo){
        next('/login');
    }
    next();
    
})


export default router