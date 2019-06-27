import Vue from 'vue'
import Router from 'vue-router'
import xyData from '@/page/xyData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'xyData',
      component: xyData
    }
  ]
})
