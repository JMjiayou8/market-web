import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {//默认进入
    path: '/',
    redirect: '/index'
  },
  {//酒店首页
    path: '/index',
    name: 'index',
    component: () => import('@/views/index.vue'),
  },
]

// eslint-disable-next-line no-new
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
