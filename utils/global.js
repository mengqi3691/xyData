import axios from 'axios'
import constants from './constants'
let global = {}
let baseUrl = ''

global.getBaseUrl = function () {
  if (!baseUrl) {
    let pathname = location.pathname.split('/')
    console.log('pathname>>>', pathname)
    pathname.splice(pathname.length - 1, 1)
    let str = pathname.join('/')
    baseUrl = location.protocol + '//' + location.host + str
  }
  return baseUrl
}

global.setBaseUrl = function (val) {
  baseUrl = val
}

global.getCustomConfig = function () {
  let res = {}
  try {
    res = JSON.parse(sessionStorage.getItem(constants.EVENT_CODE.testCustomConfig))
  } catch (e) {
  }
  return res
}

global.setCustomConfig = function (val) {
  try {
    if (!val) {
      val = {}
    }
    sessionStorage.setItem(constants.EVENT_CODE.testCustomConfig, JSON.stringify(val))
  } catch (e) {
  }
}

global.getRootUrl = function () {
  let pathname = location.pathname.split('/')
  pathname.splice(pathname.length - 1, 1)
  let str = pathname.join('/')
  console.log('路径名称pathname>>>', baseUrl)
  return location.protocol + '//' + location.host + str
}

global.init = function () {
  return new Promise((resolve, reject) => {
    axios.get(this.getRootUrl() + '/static/config/useJsonData.json').then((res) => {
      let params = res.data
      console.log('global params >>>>>>>>', params)
      if (params['CUSTOM_CONFIG']) {
        this.setCustomConfig(params['CUSTOM_CONFIG'])
      }
      if (params['BASE_URL']) {
        this.setBaseUrl(params['BASE_URL'])
      }
      resolve(res)
    }, (err) => {
      reject(err)
    })
  })
}

export default global
