import Vue from 'vue'
import Router from 'vue-router'
import Penumonia from '@/components/Penumonia'

Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Penumonia',
      component: Penumonia
    }
  ]
})
