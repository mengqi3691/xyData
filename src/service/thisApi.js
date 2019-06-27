import axios from 'axios'
// 获取列表
export const getAllDataleApi = (params) => {
  return axios.post('/api/getAllData', params)
}
// 获取关键词
export const getKeyWordApi = () => {
  return axios.get('/api/getKeyWord')
}
