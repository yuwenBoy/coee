// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import store from './store';
import App from './App'
import { router } from './router'
import Vuex from 'vuex'
import axios from 'axios'
import iView from 'iview'

import 'iview/dist/styles/iview.css'

import Print from './common/tools/print'

Vue.use(iView);
Vue.use(Vuex);
Vue.use(Print);

// 注册打印
//Vue.use(Print);

Vue.config.productionTip = false;

// axios.defaults.timeout =  10000;
axios.interceptors.request.use(function (config) {
    iView.LoadingBar.start();
    config.headers.Authorization = "Bearer " + sessionStorage.getItem('token');
    return config;
})
axios.interceptors.response.use(response => {
    if (response.data.Success === false) {
        iView.LoadingBar.error();
        iView.Message.error({ content: '请求错误:' + response.data.Message, duration: 5, closable: true });
    } else {
        iView.LoadingBar.finish();
    }

    return response;
}, error => {
    if (error.response) {
        
        // if (error.response.status === 500) {
        //     router.push({name:'is500'});
        //     return;
        // }
        iView.LoadingBar.error();
        iView.Message.error({ content: '请求错误:' + error.response.status, duration: 5, closable: true });
        return error.response;
    }
})

Vue.prototype.axios = axios;

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router: router,
    store:store,
    components: { App },
    template: '<App/>'
})
