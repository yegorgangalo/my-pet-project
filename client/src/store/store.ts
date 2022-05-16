import axios, { AxiosError } from "axios"
import { LS, ENV } from "@mandruy/common/const"
import { makeAutoObservable } from "mobx"
import AuthService from "services/AuthService"
import UserService from "services/UserService"
import GoogleService from "services/GoogleService"
import { IUser } from "interfaces/IUser"
import { IAuthResponse } from "interfaces/IAuthResponse"

export class Store {
  user = {} as IUser
  isAuth = false
  isLoadedBE = false
  isLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setIsLoadedBE() {
    this.isLoadedBE = true
  }

  setLoading(bool: boolean) {
    this.isLoading = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  async googleLogin(token: string) {
    try {
      const { data } = await GoogleService.login(token)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      this.setAuth(true)
      this.setUser(data.user)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    }
  }

  async login(email: string, password: string) {
    try {
      const { data } = await AuthService.login(email, password)
      localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
      this.setAuth(true)
      this.setUser(data.user)
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
    try {
      const user = await this.refreshToken()
      this.setAuth(true)
      this.setUser(user)
    } catch (err) {
      console.log((err as AxiosError)?.response?.data?.message)
    } finally {
      this.setIsLoadedBE()
    }
  }

  async refreshToken() {
    const { data } = await axios.get<IAuthResponse>(
      `${process.env[`REACT_APP_${ENV.SERVER_URL}`]}/auth/refresh`,
      { withCredentials: true }
    )
    localStorage.setItem(LS.ACCESS_TOKEN, data.accessToken)
    return data.user
  }

  async sendActivationMail(userId: string) {
    this.setLoading(true)
    try {
      await AuthService.sendActivationMail(userId)
    } catch (err) {
      console.log("error", (err as Error).message)
      console.log(err)
    } finally {
      this.setLoading(false)
    }
  }

  async updateUserAvatar(userId: string, formData: FormData) {
    this.setLoading(true)
    try {
      const { data } = await UserService.uploadAvatar(userId, formData)
      store.user.avatar = data
    } catch (err) {
    } finally {
      this.setLoading(false)
    }
  }
}

export const store = new Store()
