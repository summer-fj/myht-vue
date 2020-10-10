// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
// import $ from 'jquery'
// Vue.prototype.$ = $;
import store from './store'


import './eventbus'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// 把路由实例倒入
import router from './router'

import './assets/css/reset.css'

import $axios from './http'
import $api from './http/api.js'

import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

Vue.prototype.$api = $api
Vue.prototype.$axios = $axios

Vue.use(ElementUI);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  //5:把路由对象注入到根实例中
  // 在每一个组件中都可以使用this.$router和this.$route
  // router:router,
  router,
  store,
  components: { App },
  template: '<App/>'
})
