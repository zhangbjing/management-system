import Vue from 'vue'
import Router from 'vue-router'
import localhost from '../util/localhost'
import $ from 'jQuery'
import store from '../store/index'
// import { delCookie, getCookie } from '../util/util'
// 登录
import Login from '../views/Login/Login.vue'
// 体检
import Statistics from '../views/Statistics/index'
// 体检 ----》 体检人数统计
import Attribute from '../views/Statistics/Children/Attribute'
// 体检 ----》 体检人员属性分析
import Analysis from '../views/Statistics/Children/Analysis'
// 管理
import Objectives from '../views/Objectives/index.vue'
// 管理目标 ----> 管理目标统计 - 概述
import Outline from '../views/Objectives/Children/Outline.vue'
// 管理目标 ----> 管理目标属性分布
import Cobjectives from '../views/Objectives/Children/Cobjectives.vue'
// 病种
import Disease from '../views/Disease/index.vue'
// 病种 ----》 病种统计 - 概述
import Attribute_analysis from '../views/Disease/children/Attribute-analysis.vue'
// 病种 ----》 病种属性分布
import Disease_statistics from '../views/Disease/children/Disease_statistics.vue'
// 患者内容管理
// import Patient_content from '../views/Patient-content/index.vue'
// 意见与反馈
import Opinion from '../views/Opinion/index.vue'
// 修改密码
import Password from '../views/Password/index.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/statistics',
      isFull: true,
      meta: {
        isFull: true
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      isFull: true,
      meta: {
        isFull: true,
        requireAuth: true
      }
    },
    {
      title: '体检人次统计分布',
      path: '/statistics',
      name: 'statistics',
      imgUrl: 'http://p8lzo644o.bkt.clouddn.com/health_icon.png',
      component: Statistics,
      redirect: 'attribute',
      meta: {
        requireAuth: true
      },
      children: [
        {
          title: '体检人次统计',
          name: 'attribute',
          path: 'attribute',
          icon: 'images',
          component: Attribute
        },
        {
          title: '体检人员属性分布',
          name: 'analysis',
          path: 'analysis',
          icon: 'images',
          component: Analysis
        }
      ]
    },
    {
      title: '管理目标统计分布',
      path: '/objectives',
      name: 'objectives',
      imgUrl: 'http://p8lzo644o.bkt.clouddn.com/Goal_icon.png',
      component: Objectives,
      children: [
        {
          title: '管理目标分布概述',
          name: 'outline',
          path: 'outline',
          icon: 'fa fa-home fa-lg',
          component: Outline
        },
        {
          title: '各目标人群属性分布',
          name: 'cobjectives',
          path: 'cobjectives',
          icon: 'fa fa-home fa-lg',
          component: Cobjectives
        }
      ]
    },
    {
      title: '病种统计分布',
      path: '/disease',
      name: 'disease',
      imgUrl: 'http://p8lzo644o.bkt.clouddn.com/entity_icon.png',
      component: Disease,
      children: [
        {
          title: '病种分布概述',
          name: 'attribute_analysis',
          path: 'attribute_analysis',
          icon: 'fa fa-home fa-lg',
          component: Attribute_analysis
        },
        {
          title: '各病种人群属性分布',
          name: 'disease_statistics',
          path: 'disease_statistics',
          icon: 'fa fa-home fa-lg',
          component: Disease_statistics
        }
      ]
    },
    // {
    //   title: '患者内容管理',
    //   path: '/patient-content',
    //   name: 'patient-content',
    //   imgUrl: 'http://p8lzo644o.bkt.clouddn.com/content_icon.png',
    //   component: Patient_content
    // },
    {
      title: '意见与反馈',
      path: '/opinion',
      name: 'opinion',
      imgUrl: 'http://p8lzo644o.bkt.clouddn.com/feedback_icon.png',
      component: Opinion
    },
    {
      title: '修改密码',
      path: '/password',
      name: 'password',
      icon: 'fa fa-home fa-lg',
      component: Password,
      isFull: true,
      meta: {
        isPwd: true
      }
    }
  ]
})
// let obj = {
//   userId: localStorage.getItem('id'),
//   token: localStorage.getItem('token')
// }
// $.ajax({
//   type: 'get',
//   url: localhost + 'backstage/login/user',
//   dataType: 'json',
//   xhrFields: {withCredentials: true},
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8'
//   },
//   data: JSON.stringify(obj),
//   success: (data) => {
//     console.log(data)
//     console.log(localStorage.getItem('token'))
//   }
// })
// router.beforeEach((to, from, next) => {
//   if (to.meta.requireAuth) {
//     if (localStorage.getItem('token')) {
//       next()
//     } else {
//       next('/login')
//     }
//   } else {
//     next()
//   }
// })
// router.beforeEach((to, from, next) => {
//   console.log(to.matched)
//   // if (to.matched.meta(res => res.meta.requireAuth)) { // 判断是否需要登录权限
//   //   if (localStorage.getItem('token')) { // 判断是否登录
//   //     next()
//   //   } else { // 没登录则跳转到登录界面
//   //     next({
//   //       path: '/login',
//   //       query: {redirect: to.fullPath}
//   //     })
//   //   }
//   // } else {
//   //   next()
//   // }
// })
export default router
