import global from '../../utils/global'

let myglobal = {}
// 默认路由
let baseUrl = ''
myglobal.getBaseUrl = function () {
  console.log('myglobal', global.getCustomConfig())
  if (global.getCustomConfig()['BASE_URL']) {
    baseUrl = global.getCustomConfig()['BASE_URL']
  }
  return baseUrl
}
export default myglobal
