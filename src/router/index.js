import Vue from 'vue'
import Router from 'vue-router'
import CreateLink from '../components/CreateLink'
import LinkList from '../components/LinkList'
import AppLogin from '../components/AppLogin'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'LinkList',
      component: LinkList
    },
    {
      path: '/create',
      name: 'CreateLink',
      component: CreateLink
    },
    {
      path: '/login',
      component: AppLogin
    }
  ],
  mode: 'history'
})
