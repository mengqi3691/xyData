import Vue from 'vue'
import Vuex from 'vuex'
import thisVuex from './modules/thisVuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  namespaced: true,
  modules: {
    thisVuex
  }
})
export default store
