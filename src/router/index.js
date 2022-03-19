import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/views/Login'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    children: [
      // 服务列表
      {
        path: 'service', // /home/service
        name: 'Service',
        component: () => import(/* webpackChunkName: "service" */ '../views/Service.vue')
      },
      // 产品容器
      {
        path: 'product', // /home/product
        name: 'Product',
        component: () => import(/* webpackChunkName: "product" */ '../views/Product.vue'),
        children: [
          // 产品列表
          {
            path: 'list', // /home/product/list
            name: 'ProductList',
            component: () => import(/* webpackChunkName: "productList" */ '../views/ProductList.vue')
          },
          // 产品新增
          {
            path: 'add/0', // /home/product/add/0
            name: 'ProductAdd',
            component: () => import(/* webpackChunkName: "productEdit" */ '../views/ProductEdit.vue')
          },
          // 产品编辑
          // 产品编辑和产品新增是共用一个组件
          {
            path: 'edit/:id', // /home/product/edit/:id
            name: 'ProductEdit',
            component: () => import(/* webpackChunkName: "productEdit" */ '../views/ProductEdit.vue')
          }
        ]
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 设置全局导航守卫 / 路由拦截
// 进入/home 之前 必须有token
router.beforeEach((to, from, next) => {
  if (to.path === '/home') {
    const token = sessionStorage.getItem('token')
    if (token) { // 存在token 跳转/home
      next()
    } else { // 没有token 跳转/
      next('/')
    }
  } else { // 不是去/home 直接跳转
    next()
  }
})

export default router
