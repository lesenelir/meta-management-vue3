// 将request.js 整体导入
import request from '@/request/request'

// 按需导出每个请求，即按需导出每个api
export const getData = () => request.get('/meta-management-vue3/item')
