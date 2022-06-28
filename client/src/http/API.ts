import { ENV, LS } from "@mandruy/common/const"
import axios from "axios"
import { IAuthResponse } from "interfaces/IAuthResponse"

export const refreshToken = async () => {
  const { data } = await axios.get<IAuthResponse>(
    `${process.env[`REACT_APP_${ENV.SERVER_URL}`]}/auth/refresh`,
    { withCredentials: true }
  )
  localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
  return data.user
}

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
