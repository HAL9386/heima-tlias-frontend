import axios from "axios"

const request = axios.create({
  baseURL: '/api',
  timeout: 10 * 60 * 1000, // 10 minutes
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
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
