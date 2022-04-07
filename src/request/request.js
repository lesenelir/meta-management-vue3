// 用来做拦截的
import axios from 'axios'
import store from '@/store'

// 创建一个实例
const instance = axios.create({
  // baseURL: 'http://yapi.smart-xwork.cn/mock/143899',
  baseURL: 'https://www.fastmock.site/mock/b608b602f0d70e8d6c904695f538eceb/api',
  timeout: 6000
})

// 拦截器 - 请求拦截
instance.interceptors.request.use(config => {
  // 模拟部分接口需要拿到token
  const token = sessionStorage.getItem('token')
  if (token) {
    // 自定义头部信息 - 设置请求头参数信息
    config.headers.token = token
    config.headers.Authorization = token
  }
  // 请求 显示loading
  store.commit('changeLoading', true)
  console.log(store.state.loading)
  return config
}, error => {
  return Promise.reject(error)
})

// 拦截器 - 响应拦截
instance.interceptors.response.use(res => {
  // 响应 隐藏loading
  store.commit('changeLoading', false)
  console.log(store.state.loading)
  return res
}, error => {
  return Promise.reject(error)
})

// 整体导出
export default instance
