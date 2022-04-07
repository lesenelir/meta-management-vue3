import { createStore } from 'vuex'

export default createStore({
  state: {
    // 全局数据
    globalData: {},
    // loading
    loading: true
  },
  getters: {
    // 获取全局数据 有key获取对应值，没有key获取全部值
    getGlobalData: (state) => (key) => {
      return key ? state.globalData[key] : state.globalData
    }
  },
  mutations: {
    // 设置全局数据
    setGlobalData (state, payload) {
      // if (payload.key === undefined || payload.value === undefined) {
      //   return
      // }
      state.globalData = {
        ...state.globalData,
        [payload.key]: payload.value
      }
    },
    // 清除全局数据 传key清除对应数据 不传key清除全部值
    clearGlobalData (state, payload) {
      if (payload.key === undefined) {
        state.globalData = {}
      } else {
        delete state.globalData[payload.key]
      }
    },
    // 显示 loading = true  - 此时数据还没有加载出来 （请求头）
    changeLoading (state, payload) {
      state.loading = payload
    }
  },
  actions: {},
  modules: {}
})
