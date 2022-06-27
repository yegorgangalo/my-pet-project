import { ENV, LS } from "@mandruy/common/const"
import axios from "axios"
import { refreshToken } from "../redux/user/operations"

const API = axios.create({
  withCredentials: true,
  baseURL: process.env[`REACT_APP_${ENV.SERVER_URL}`],
})

API.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    LS.ACCESS_TOKEN
  )}`
  return config
})

API.interceptors.response.use(
  (config) => config,
  async (err) => {
    try {
      const originalRequest = err.config
      if (err.response.status === 403 && !err.config?._isRetry) {
        originalRequest._isRetry = true
        refreshToken()
        return API.request(originalRequest)
      }
    } catch (err) {
      console.log(err)
    }
    throw err
  }
)

export default API
