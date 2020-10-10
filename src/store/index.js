import Vue from 'vue'
// 1.导入vue包
import Vuex from 'vuex'
// 使用这个插件
Vue.use(Vuex);

import state from './state'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
// 在store中引入插件实现数据永久保存
import createPersistedstate from 'vuex-persistedstate'

// 2. 创建store对象
export default new Vuex.Store({
    // store数据源, 提供唯一公共数据
    state,
    mutations,
    actions,
    getters,
    plugins:[createPersistedstate()]
})