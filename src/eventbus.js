import Vue from 'vue'
// 1.创建公共区域(新的uve实例)
var eventbus = new Vue();
// 2.公共区域挂载到vue的原型上面(每一个vue实例都可以访问它原型上的成员)
Vue.prototype.$bus = eventbus;