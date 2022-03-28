// 用来做拦截的
import axios from 'axios'

// 创建一个实例
const instance = axios.create({
  baseURL: 'http://yapi.smart-xwork.cn/mock/143899',
  timeout: 6000
})

// 拦截器 - 请求拦截
instance.interceptors.request.use(config => {
  // 部分接口需要拿到token
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.token = token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 拦截器 - 响应拦截
instance.interceptors.response.use(res => {
  return res
}, error => {
  return Promise.reject(error)
})

// 整体导出
export default instance
