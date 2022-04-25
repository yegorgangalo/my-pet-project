import axios, { AxiosError } from "axios"
import { LS, ENV } from "@mandruy/common/const"
import { makeAutoObservable } from "mobx"
import { IUser } from "../models/IUser"
import AuthService from "../services/AuthService"
import { AuthResponse } from "../models/response/AuthResponse"

export default class Store {
  user = {} as IUser
  isAuth = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  async login(email: string, password: string) {
    try {
      const { data } = await AuthService.login(email, password)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      this.setAuth(true)
      this.setUser(data.user)
      console.log(data)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    }
  }

  async registration(name: string, email: string, password: string) {
    try {
      const { data } = await AuthService.registration(name, email, password)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      this.setAuth(true)
      this.setUser(data.user)
      console.log(data)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    }
  }

  async logout() {
    try {
      await AuthService.logout()
      localStorage.removeItem(LS.ACCESS_TOKEN)
      this.setAuth(false)
      this.setUser({} as IUser)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    }
  }

  async checkAuth() {
    this.setLoading(true)
    try {
      const user = await this.refreshToken()
      this.setAuth(true)
      this.setUser(user)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    } finally {
      this.setLoading(false)
    }
  }

  async refreshToken() {
    const { data } = await axios.get<AuthResponse>(
      `${process.env[`REACT_APP_${ENV.SERVER_URL}`]}/auth/refresh`,
      { withCredentials: true }
    )
    localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
    return data.user
  }
}
