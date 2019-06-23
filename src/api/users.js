import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
// 拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // console.log(config)
  // 读取数据
  var token = localStorage.getItem('itcast_token')
  // 必须在请求头中使用 `Authorization` 字段提供 `token` 令牌
  config.headers.Authorization = token
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 登录
export const userlogin = (data) => {
  return axios({
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户列表数据
export const getAllList = (params) => {
  return axios({
    url: 'users',
    params
  })
}

// 添加用户
export const addUser = (data) => {
  return axios({
    url: 'users',
    method: 'post',
    data
  })
}
