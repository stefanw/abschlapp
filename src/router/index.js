import Vue from 'vue'
import Router from 'vue-router'

import Index from '@/components/index'
import Documentation from '@/components/documentation'
import Call from '@/components/call'
import Result from '@/components/result'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Index,
      props: true
    },
    {
      path: '/documentation/',
      name: 'documentation',
      component: Documentation,
      props: true
    },
    {
      path: '/call/',
      name: 'call',
      component: Call,
      props: true
    },
    {
      path: '/result/',
      name: 'result',
      component: Result,
      props: true
    }
  ]
})
