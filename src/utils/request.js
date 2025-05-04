import axios from "axios"

const request = axios.create({
  baseURL: 'https://m1.apifoxmock.com/m1/6270372-5964539-default',
  timeout: 10 * 60 * 1000, // 10 minutes
  params: {
    apifoxApiId: '291715989',
    apifoxToken: 'OO_sn0SVdz6Y48zdxRJw-'
  }
})

request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
