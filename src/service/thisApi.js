import axios from 'axios'
import myGlobal from '../utils/myglobal'
// 获取列表
export const getAllDataleApi = (params) => {
  console.log('baseUrl', myGlobal.getBaseUrl())
  return axios.post('/api/getAllData', params)
}
// 获取关键词
export const getKeyWordApi = () => {
  return axios.get('/api/getKeyWord')
}
