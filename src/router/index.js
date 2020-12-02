import Vue from 'vue'
import Util from '@/libs/util';
import Router from 'vue-router'
import VueCookies from 'vue-cookies'
import { routers, otherRouter, appRouter,welcome } from './router';
import Api from "../api/api.js";

Vue.use(Router)
Vue.use(VueCookies)

// 路由配置
const RouterConfig = {
  mode: 'history',
  routes: routers
};

export const router = new Router(RouterConfig);

router.beforeEach((to, from, next) => {
  
  // 替换title 
  if (to.meta.title) {
    document.title = to.meta.title;  
  }

  if (typeof (to.query.token) == 'undefined') {
    if ((sessionStorage.getItem('token') == null || sessionStorage.getItem('token') == "") && to.name == 'login') {
      next()
    } else if ((sessionStorage.getItem('token') == null || sessionStorage.getItem('token') == "") && to.name != 'login') {
      next({
        name: 'login'
      })
    }
    else if (sessionStorage.getItem('token') != null && sessionStorage.getItem('token') != "" && to.name == 'login') {
      next({
        name: 'welcome'
      })
    } else {
      const curRouterObj = Util.getRouterObjByName([otherRouter, ...appRouter,welcome], to.name);
      if (curRouterObj) { // 需要判断权限的路由
        Api.Customer.ModuleTree().then(function (response) {
          router.app.$store.commit('updateMenulist', response.data.data);
          const customerRouter = Util.CheckCustomerRouter(router.app.$store.state.app.menuList, to.name)
          if (customerRouter) {
            Api.Customer.ActionPermission(to.name).then(function (response1) {
              router.app.$store.commit('updateRole', response1.data.data);
            }).catch(function (error) {
              console.log(error);
            })
            const openM = Util.getOpenMenu(response.data.data, to.name);
            if (openM.length > 0) {
              router.app.$store.commit('updateOpenMenu', openM[0]);
            }
            router.app.$store.commit('updateActionMenu', to.name);
            next();
          } else {
            next({
              name: 'is403'
            });//权限不足跳转到另外一个页面
          }
        }).catch(function (error) {
          console.log(error);
        })
      } else { // 没有配置权限的路由, 直接通过
        Util.toDefaultPage([...routers], to.name, router, next);
      }
    }
  }
  else if (typeof (to.query.token) != 'undefined' && to.name == 'login') {
    sessionStorage.setItem('token', to.query.token)
    next({
      name: 'welcome'
    })
  } else {
    next(false)
  }

});
