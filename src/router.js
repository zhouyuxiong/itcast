import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '@/views/login.vue'

Vue.use(VueRouter)

var router = new VueRouter({
  routes: [
    {
      name: 'Login',
      path: '/login',
      component: Login
    }
  ]
})

export default router
