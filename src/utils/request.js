import axios from "axios"
import router from "@/router"
import { ElMessage } from "element-plus"

const request = axios.create({
  baseURL: '/api',
  timeout: 10 * 60 * 1000, // 10 minutes
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    if (error.response.status == 401) {
      ElMessage.error('登录失效，请重新登录')
      router.push('/login')
    } else {
      ElMessage.error('接口访问异常')
    }
    return Promise.reject(error)
  }
)

request.interceptors.request.use(
  (config) => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser'))
    if (loginUser) {
      config.headers['token'] = loginUser.token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
