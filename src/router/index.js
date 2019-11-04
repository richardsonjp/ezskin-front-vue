import Vue from 'vue'
import Router from 'vue-router'
// import Alert from '@/components/Alert'
// import Header from '@/components/Header'
import MessageError from '@/components/MessageError'
import Welcome from '@/components/contents/Welcome'
import Login from '@/components/Login'
import Logout from '@/components/Logout'

import Games from '@/components/contents/Games'
import SalesTab from '@/components/contents/SalesTab'
import SalesAll from '@/components/contents/SalesAll'
import SalesCsgo from '@/components/contents/SalesCsgo'
import SalesDota from '@/components/contents/SalesDota'
import SalesDetail from '@/components/contents/SalesDetail'
import SalesUpdateModal from '@/components/contents/SalesUpdateModal'
import User from '@/components/contents/User'

Vue.use(Router)
Vue.component('message-error', MessageError)
Vue.component('SalesAll', SalesAll)
Vue.component('SalesCsgo', SalesCsgo)
Vue.component('SalesDota', SalesDota)
Vue.component('SalesDetail', SalesDetail)
Vue.component('SalesUpdateModal', SalesUpdateModal)

const router = new Router({
  mode: 'history',
  base: process.env.VUE_APP_DASHBOARD_URL,
  routes: [
    { path: '/login', name: 'login', component: Login },
    { path: '/logout', name: 'logout', component: Logout },
    { path: '/', name: 'home', component: Welcome,
      meta: {needAuth: true}},
    { path: '/user', name: 'user', component: User,
    meta: {needAuth: true}},
    { path: '/sales', name: 'sales', component: SalesTab, 
      meta: {needAuth: true}},
    { path: '/games', name: 'games', component: Games,
    meta: {needAuth: true}},
  ],
})

router.beforeEach((to, from, next) => {
const user = localStorage.getItem('user')
const token = localStorage.getItem('token')
next()
  if (user && token) {
    next()
  } else {
    setTimeout(()=> {
      next('/login');
    }, 500)
  }
});

export default router